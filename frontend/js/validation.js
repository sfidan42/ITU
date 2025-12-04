// validation.js - Data Validation Module

class DataValidator {
    static validateTCNo(tcNo) {
        // TC No must be 11 digits
        if (!tcNo || tcNo.length !== 11) {
            return { valid: false, error: 'TC Kimlik No 11 haneli olmalıdır' };
        }
        
        // Must be numeric
        if (!/^\d+$/.test(tcNo)) {
            return { valid: false, error: 'TC Kimlik No sadece rakamlardan oluşmalıdır' };
        }
        
        // First digit cannot be 0
        if (tcNo[0] === '0') {
            return { valid: false, error: 'TC Kimlik No 0 ile başlayamaz' };
        }
        
        return { valid: true };
    }
    
    static validateRegistrNo(registrNo) {
        if (!registrNo) {
            return { valid: false, error: 'Sicil No zorunludur' };
        }
        
        const registrInt = parseInt(registrNo);
        if (isNaN(registrInt) || registrInt <= 0) {
            return { valid: false, error: 'Geçerli bir Sicil No giriniz' };
        }
        
        return { valid: true };
    }
    
    static validateEmail(email) {
        if (!email) {
            return { valid: false, error: 'E-posta adresi zorunludur' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Geçerli bir e-posta adresi giriniz' };
        }
        
        return { valid: true };
    }
    
    static validateITUEmail(email) {
        const result = this.validateEmail(email);
        if (!result.valid) return result;
        
        if (!email.endsWith('@itu.edu.tr')) {
            return { valid: false, error: 'İTÜ e-posta adresi @itu.edu.tr ile bitmelidir' };
        }
        
        return { valid: true };
    }
    
    static validateDate(dateStr) {
        if (!dateStr) {
            return { valid: false, error: 'Tarih zorunludur' };
        }
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return { valid: false, error: 'Geçerli bir tarih giriniz (YYYY-MM-DD)' };
        }
        
        return { valid: true };
    }
    
    static validatePerson(person) {
        const errors = [];
        
        const tcResult = this.validateTCNo(person.tc_no);
        if (!tcResult.valid) errors.push(tcResult.error);
        
        if (!person.name || person.name.trim().length === 0) {
            errors.push('İsim zorunludur');
        }
        
        if (!person.surname || person.surname.trim().length === 0) {
            errors.push('Soyisim zorunludur');
        }
        
        const registrResult = this.validateRegistrNo(person.registr_no);
        if (!registrResult.valid) errors.push(registrResult.error);
        
        if (person.personal_mail) {
            const emailResult = this.validateEmail(person.personal_mail);
            if (!emailResult.valid) errors.push(emailResult.error);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    static validatePersonnel(personnel) {
        const errors = [];
        
        const registrResult = this.validateRegistrNo(personnel.registr_no);
        if (!registrResult.valid) errors.push(registrResult.error);
        
        const emailResult = this.validateITUEmail(personnel.itu_mail);
        if (!emailResult.valid) errors.push(emailResult.error);
        
        if (!personnel.department || personnel.department.trim().length === 0) {
            errors.push('Bölüm zorunludur');
        }
        
        if (personnel.registration_date) {
            const dateResult = this.validateDate(personnel.registration_date);
            if (!dateResult.valid) errors.push(dateResult.error);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}
