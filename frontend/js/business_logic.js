// business_logic.js - Business Rules and Calculations

class BusinessLogic {
    
    // --- Professor Logic ---
    static calculateProfessorScores(yearsServed) {
        let scores = {
            makam_tazminati: 0,
            universite_odenegi: 0,
            ek_gosterge: 0
        };

        if (yearsServed >= 4) {
            scores.makam_tazminati = 6000;
            scores.universite_odenegi = 245;
            scores.ek_gosterge = 7000;
        } else if (yearsServed >= 3) {
            scores.makam_tazminati = 4500;
            scores.universite_odenegi = 215;
            scores.ek_gosterge = 5800;
        }

        return scores;
    }

    // --- Research Assistant Logic ---
    static calculateResearchAssistantExtension(type, educationLevel, yearsServed, scientificPrepYears = 0) {
        // type: '33a' or '50d'
        // educationLevel: 'master' or 'phd'
        
        if (type === '33a') {
            return { canExtend: true, message: '33a maddesi uyarınca görev uzatımı yapılabilir.' };
        }

        if (type === '50d') {
            const effectiveYears = yearsServed - scientificPrepYears;

            if (educationLevel === 'master') {
                // Max 3 years. 
                if (effectiveYears < 3) {
                    return { canExtend: true, duration: 1, unit: 'year', message: 'Yüksek lisans için 1 yıl uzatılabilir.' };
                } else if (effectiveYears === 3) {
                    return { canExtend: true, duration: 6, unit: 'month', message: 'Yüksek lisans süresi doldu. 6 ay ek süre verilebilir.' };
                } else {
                    return { canExtend: false, message: 'Yüksek lisans azami süresi (3 yıl + 6 ay) dolmuştur.' };
                }
            } else if (educationLevel === 'phd') {
                // Max 6 years
                if (effectiveYears < 6) {
                    return { canExtend: true, duration: 1, unit: 'year', message: 'Doktora için 1 yıl uzatılabilir.' };
                } else {
                    return { canExtend: false, message: 'Doktora azami süresi (6 yıl) dolmuştur.' };
                }
            }
        }

        return { canExtend: false, message: 'Bilinmeyen durum.' };
    }

    // --- Language Score Logic ---
    static checkLanguageScoreValidity(examDateStr) {
        const examDate = new Date(examDateStr);
        const today = new Date();
        const diffTime = Math.abs(today - examDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

        if (diffYears > 5) {
            return { valid: false, message: 'Dil puanı geçerlilik süresi (5 yıl) dolmuştur. Puan düşümü veya yeni belge gereklidir.' };
        }
        return { valid: true, message: 'Dil puanı geçerli.' };
    }

    // --- Administrative Staff Logic ---
    static calculateNextPromotion(registrationDateStr, lastPromotionDateStr = null) {
        const startDate = new Date(lastPromotionDateStr || registrationDateStr);
        const nextDate = new Date(startDate);
        nextDate.setFullYear(nextDate.getFullYear() + 8);
        return nextDate;
    }

    // --- Notification Generator ---
    static generateNotifications(data) {
        const notifications = [];
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(today.getMonth() + 1);

        // 1. Unpaid Leave Return
        // Assuming 'leaves' array in personel object: [{ type: 'unpaid', start: '...', end: '...' }]
        if (data.personel) {
            data.personel.forEach(p => {
                if (p.leaves) {
                    p.leaves.forEach(leave => {
                        if (leave.type === 'unpaid') {
                            const returnDate = new Date(leave.end);
                            if (returnDate > today && returnDate <= oneMonthLater) {
                                const person = data.persons.find(per => per.registr_no === p.registr_no);
                                notifications.push({
                                    type: 'warning',
                                    title: 'Ücretsiz İzin Dönüşü',
                                    message: `${person ? person.name + ' ' + person.surname : p.registr_no} sicil nolu personelin ücretsiz izni ${leave.end} tarihinde bitiyor.`,
                                    registr_no: p.registr_no
                                });
                            }
                        }
                    });
                }
            });
        }

        // 2. Language Score Expiry
        if (data.personelLanguageScores) {
            data.personelLanguageScores.forEach(score => {
                const validity = this.checkLanguageScoreValidity(score.date);
                if (!validity.valid) {
                    notifications.push({
                        type: 'info',
                        title: 'Dil Puanı Süresi',
                        message: `${score.name} isimli personelin ${score.date} tarihli dil puanının süresi dolmuştur.`,
                        tc_no: score.tc_no
                    });
                }
            });
        }

        // 3. Duty Extensions (Academic)
        if (data.lowAcademic) {
            data.lowAcademic.forEach(la => {
                // Assuming last_duty_ext_date is the start of the current extension
                // We need to know the duration to calculate end date. 
                // For simplicity, let's assume standard 1 year if not specified, or check 'next_ext_date' if available in extensions table
                // But here we might just check if last extension was long ago.
                
                // Better: Check 'duty_extensions' from storage if available, find the latest 'next_ext_date'
                // This part requires access to the joined data structure or we iterate raw tables.
            });
        }

        return notifications;
    }
}

window.BusinessLogic = BusinessLogic;
