import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import conventionService from '../../Services/conventionService';
import SignatureCanvas from 'react-signature-canvas';
import '../../Style/Convention/SignerConvention.css';

const SignerConvention = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [validatingOtp, setValidatingOtp] = useState(false);
    const [signing, setSigning] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [signatureStatus, setSignatureStatus] = useState(null);

    // Référence au pad de signature
    const sigPad = useRef(null);

    // Charger la convention et son statut
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [conv, status] = await Promise.all([
                    conventionService.getById(id),
                    conventionService.getSignatureStatus(id)
                ]);
                setConvention(conv);
                setSignatureStatus(status);
                if (status?.estSignee) {
                    setSuccessMessage('Cette convention est déjà signée.');
                }
            } catch (err) {
                console.error(err);
                setError('Impossible de charger les informations de la convention.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    // Envoyer l'OTP
    const handleSendOtp = async () => {
        if (!convention) return;
        if (convention.statut === 'SIGNEE_PAR_ENTREPRISE') {
            setError('Cette convention est déjà signée, vous ne pouvez plus demander d’OTP.');
            return;
        }
        setSendingOtp(true);
        setError('');
        try {
            await conventionService.sendOtp(id);
            setOtpSent(true);
            alert('Un code OTP a été envoyé à votre adresse e-mail.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de l’envoi du code.');
        } finally {
            setSendingOtp(false);
        }
    };

    // Récupérer l'image de la signature (base64)
    const getSignatureImage = () => {
        if (sigPad.current && !sigPad.current.isEmpty()) {
            return sigPad.current.toDataURL('image/png');
        }
        return null;
    };

    // Effacer la signature
    const clearSignature = () => {
        sigPad.current.clear();
    };

    // Valider OTP et envoyer la signature
    const handleValidateOtp = async () => {
        if (!otp.trim()) {
            setError('Veuillez saisir le code OTP reçu.');
            return;
        }

        const signature = getSignatureImage();
        if (!signature) {
            setError('Veuillez dessiner votre signature avant de valider.');
            return;
        }

        setValidatingOtp(true);
        setError('');
        try {
            const result = await conventionService.validateOtp(id, {
                otp: otp.trim(),
                signatureImage: signature
            });

            setConvention(result);
            setSignatureStatus({ estSignee: true, statut: result.statut });
            setSuccessMessage('Convention signée avec succès ! Redirection dans 3 secondes...');
            setTimeout(() => navigate('/entreprise/conventions'), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Code OTP invalide ou expiré.');
        } finally {
            setValidatingOtp(false);
        }
    };

    // telecharger le PDF
    const handleDownloadPdf = async () => {
        try {
            const blob = await conventionService.generatePdf(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `convention_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la génération du PDF.');
        }
    };

    if (loading) {
        return <div className="signer-loader">Chargement de la convention...</div>;
    }

    if (error && !convention) {
        return <div className="signer-error">{error}</div>;
    }

    const isSigned = signatureStatus?.estSignee || convention?.statut === 'SIGNEE_PAR_ENTREPRISE';

    return (
        <div className="signer-container">
            <h2>✍️ Signature électronique</h2>

            <div className="convention-card">
                <h3>Convention #{convention.id}</h3>
                <p><strong>Sujet :</strong> {convention.sujetStage}</p>
                <p><strong>Dates :</strong> du {convention.dateDebut} au {convention.dateFin}</p>
                <p><strong>Statut :</strong>
                    <span className={`badge ${isSigned ? 'badge-success' : 'badge-warning'}`}>
            {isSigned ? 'Signée' : (convention.statut || 'En attente')}
          </span>
                </p>
            </div>

            {isSigned ? (
                <div className="alert alert-info">
                    Cette convention est déjà signée. Vous pouvez télécharger le PDF ci-dessous.
                    <div className="pdf-button">
                        <button onClick={handleDownloadPdf} className="btn btn-outline-primary">
                            📄 Télécharger le PDF
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Étape 1 : Générer et lire la convention */}
                    <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
                        <p>Veuillez générer et lire la convention avant de la signer.</p>
                        <button onClick={handleDownloadPdf} className="btn btn-outline-dark">
                            📄 1. Générer et lire la convention
                        </button>
                    </div>

                    {!otpSent ? (
                        <div className="otp-section">
                            <p>Un code à usage unique sera envoyé à votre adresse e-mail pour confirmer votre signature.</p>
                            <button onClick={handleSendOtp} disabled={sendingOtp} className="btn btn-primary">
                                {sendingOtp ? 'Envoi en cours...' : '📧 2. Envoyer le code OTP'}
                            </button>
                        </div>
                    ) : (
                        <div className="otp-section">
                            <label>Code OTP reçu par e-mail :</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength="6"
                                className="otp-input"
                                autoFocus
                            />

                            {/* Pad de signature */}
                            <div className="signature-pad-container" style={{ marginTop: '20px' }}>
                                <p><strong>Votre signature manuscrite :</strong></p>
                                <SignatureCanvas
                                    ref={sigPad}
                                    penColor="black"
                                    canvasProps={{
                                        width: 400,
                                        height: 200,
                                        className: 'sigCanvas',
                                        style: { border: '1px solid #ccc', borderRadius: '5px' }
                                    }}
                                />
                                <button
                                    onClick={clearSignature}
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{ marginTop: '5px' }}
                                >
                                    🗑️ Effacer
                                </button>
                            </div>

                            <button
                                onClick={handleValidateOtp}
                                disabled={validatingOtp || signing}
                                className="btn btn-success"
                                style={{ marginTop: '15px' }}
                            >
                                {validatingOtp ? 'Vérification...' : (signing ? 'Signature...' : '🔏 3. Valider et signer')}
                            </button>
                        </div>
                    )}
                </>
            )}

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="back-button">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    Retour à la liste
                </button>
            </div>
        </div>
    );
};

export default SignerConvention;