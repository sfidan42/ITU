// business_logic.js - Business Rules and Logic Module

class BusinessLogic {
    
    // Calculate next extension date for Araştırma Görevlisi
    static calculateNextExtensionForResearchAssistant(currentDate, appointmentClause, degreeLevel) {
        const current = new Date(currentDate);
        
        if (appointmentClause === '33a') {
            // 33a starts from course beginning date
            return null; // No automatic extension
        }
        
        if (appointmentClause === '50d') {
            if (degreeLevel === 'Yüksek Lisans') {
                // 3 years for Master's + optional 6 months
                current.setFullYear(current.getFullYear() + 3);
                return current.toISOString().split('T')[0];
            } else if (degreeLevel === 'Doktora') {
                // 6 years for PhD
                current.setFullYear(current.getFullYear() + 6);
                return current.toISOString().split('T')[0];
            }
        }
        
        return null;
    }
    
    // Calculate next extension date for Öğretim Görevlisi
    static calculateNextExtensionForLecturer(currentDate, currentYear = new Date().getFullYear()) {
        const current = new Date(currentDate);
        
        if (currentYear < 2026) {
            // Before 2026: 1 year extension
            current.setFullYear(current.getFullYear() + 1);
        } else {
            // From 2026 onwards: 2 year extension
            current.setFullYear(current.getFullYear() + 2);
        }
        
        return current.toISOString().split('T')[0];
    }
    
    // Calculate next appointment for Dr. Öğretim Üyesi
    static calculateNextAppointmentForAssistantProfessor(initialDate, isFirstAppointment = true) {
        const current = new Date(initialDate);
        
        if (isFirstAppointment) {
            // First appointment: 3 years
            current.setFullYear(current.getFullYear() + 3);
        } else {
            // Subsequent appointments: 4 years
            current.setFullYear(current.getFullYear() + 4);
        }
        
        return current.toISOString().split('T')[0];
    }
    
    // Calculate compensation for Profesör
    static calculateProfessorCompensation(appointmentDate) {
        const appointment = new Date(appointmentDate);
        const now = new Date();
        const yearsServed = (now - appointment) / (1000 * 60 * 60 * 24 * 365.25);
        
        const compensation = {
            makamTazmini: 0,
            universiteOdenegi: 0,
            ekGosterge: 0
        };
        
        if (yearsServed >= 3) {
            compensation.makamTazmini = 4500;
            compensation.universiteOdenegi = 215;
            compensation.ekGosterge = 5900;
        }
        
        if (yearsServed >= 4) {
            compensation.universiteOdenegi = 245;
            compensation.ekGosterge = 7000;
        }
        
        if (yearsServed >= 5) {
            compensation.makamTazmini = 6000;
        }
        
        return compensation;
    }
    
    // Calculate next promotion date for İdari Personel
    static calculateNextPromotionForAdministrative(lastPromotionDate) {
        const lastPromotion = new Date(lastPromotionDate);
        // Every 8 years
        lastPromotion.setFullYear(lastPromotion.getFullYear() + 8);
        return lastPromotion.toISOString().split('T')[0];
    }
    
    // Calculate next language compensation renewal date
    static calculateNextLanguageRenewalDate(lastExamDate) {
        const lastExam = new Date(lastExamDate);
        // Every 5 years
        lastExam.setFullYear(lastExam.getFullYear() + 5);
        return lastExam.toISOString().split('T')[0];
    }
    
    // Determine language score degradation
    static degradeLanguageScore(currentScore) {
        const scoreMap = { 'A': 'B', 'B': 'C', 'C': null };
        return scoreMap[currentScore] || null;
    }
    
    // Determine language score upgrade
    static upgradeLanguageScore(currentScore, newScore) {
        const scores = ['C', 'B', 'A'];
        const currentIndex = scores.indexOf(currentScore);
        const newIndex = scores.indexOf(newScore);
        
        if (newIndex > currentIndex) {
            return newScore;
        }
        return currentScore;
    }
    
    // Check if extension is needed (notification)
    static needsExtensionNotification(extensionDate, notificationDaysBefore = 30) {
        if (!extensionDate) return false;
        
        const extension = new Date(extensionDate);
        const now = new Date();
        const daysUntilExtension = (extension - now) / (1000 * 60 * 60 * 24);
        
        return daysUntilExtension <= notificationDaysBefore && daysUntilExtension >= 0;
    }
    
    // Check if unpaid leave affects extension dates
    static adjustExtensionForUnpaidLeave(originalExtensionDate, unpaidLeaveDays) {
        const extension = new Date(originalExtensionDate);
        extension.setDate(extension.getDate() + unpaidLeaveDays);
        return extension.toISOString().split('T')[0];
    }
    
    // Get position title from duty type and details
    static getPositionTitle(dutyType, details = {}) {
        if (dutyType === 'LOW_ACADEMIC') {
            if (details.appointmentClause) {
                return 'Araştırma Görevlisi';
            }
            return 'Öğretim Görevlisi';
        }
        
        if (dutyType === 'HIGH_ACADEMIC') {
            // This should be determined from scores or other data
            // For now, return generic
            return 'Öğretim Üyesi';
        }
        
        return 'Personel';
    }
    
    // Calculate years of service
    static calculateYearsOfService(registrationDate) {
        if (!registrationDate) return 0;
        
        const registration = new Date(registrationDate);
        const now = new Date();
        const years = (now - registration) / (1000 * 60 * 60 * 24 * 365.25);
        
        return Math.floor(years);
    }
    
    // Get upcoming notifications
    static getUpcomingNotifications(personnel, extensionDate, languageRenewalDate) {
        const notifications = [];
        
        if (this.needsExtensionNotification(extensionDate)) {
            const daysLeft = Math.ceil((new Date(extensionDate) - new Date()) / (1000 * 60 * 60 * 24));
            notifications.push({
                type: 'extension',
                message: `Görev süresi ${daysLeft} gün içinde dolacak`,
                priority: 'high',
                daysLeft
            });
        }
        
        if (this.needsExtensionNotification(languageRenewalDate, 60)) {
            const daysLeft = Math.ceil((new Date(languageRenewalDate) - new Date()) / (1000 * 60 * 60 * 24));
            notifications.push({
                type: 'language',
                message: `Yabancı dil belgesi ${daysLeft} gün içinde yenilenmelidir`,
                priority: 'medium',
                daysLeft
            });
        }
        
        return notifications;
    }
}
