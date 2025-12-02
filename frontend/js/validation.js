// validation.js - Data Validation and Error Handling

class Validator {
    
    // TC Kimlik No validation (11 digits, Turkish ID algorithm)
    static validateTcNo(tc) {
        if (!tc || tc.length !== 11) {
            return { valid: false, message: 'TC No 11 haneli olmalıdır!' };
        }
        
        if (!/^\d+$/.test(tc)) {
            return { valid: false, message: 'TC No sadece rakamlardan oluşmalıdır!' };
        }
        
        if (tc[0] === '0') {
            return { valid: false, message: 'TC No 0 ile başlayamaz!' };
        }
        
        // Turkish ID validation algorithm
        const digits = tc.split('').map(Number);
        const sum10 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - 
                      (digits[1] + digits[3] + digits[5] + digits[7]);
        const control10 = sum10 % 10;
        
        if (control10 !== digits[9]) {
            return { valid: false, message: 'Geçersiz TC No!' };
        }
        
        const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
        const control11 = sum11 % 10;
        
        if (control11 !== digits[10]) {
            return { valid: false, message: 'Geçersiz TC No!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Email validation
    static validateEmail(email, required = false) {
        if (!email && !required) {
            return { valid: true, message: '' };
        }
        
        if (!email && required) {
            return { valid: false, message: 'Email adresi gereklidir!' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Geçersiz email formatı!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // ITU Email validation
    static validateItuEmail(email) {
        if (!email) {
            return { valid: false, message: 'İTÜ email adresi gereklidir!' };
        }
        
        if (!email.endsWith('@itu.edu.tr')) {
            return { valid: false, message: 'İTÜ email adresi @itu.edu.tr ile bitmelidir!' };
        }
        
        return this.validateEmail(email, true);
    }

    // Registration number validation
    static validateRegistrNo(registr_no) {
        if (!registr_no) {
            return { valid: false, message: 'Sicil numarası gereklidir!' };
        }
        
        const num = parseInt(registr_no);
        if (isNaN(num) || num <= 0) {
            return { valid: false, message: 'Sicil numarası pozitif bir sayı olmalıdır!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Name validation
    static validateName(name, fieldName = 'İsim') {
        if (!name || name.trim() === '') {
            return { valid: false, message: `${fieldName} gereklidir!` };
        }
        
        if (name.length < 2) {
            return { valid: false, message: `${fieldName} en az 2 karakter olmalıdır!` };
        }
        
        if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(name)) {
            return { valid: false, message: `${fieldName} sadece harflerden oluşmalıdır!` };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Gender validation
    static validateGender(gender, required = false) {
        if (!gender && !required) {
            return { valid: true, message: '' };
        }
        
        const validGenders = ['Erkek', 'Kadın', 'E', 'K', 'Male', 'Female', 'M', 'F'];
        if (gender && !validGenders.includes(gender)) {
            return { valid: false, message: 'Geçersiz cinsiyet değeri! (Erkek/Kadın veya E/K)' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Date validation
    static validateDate(date, required = false) {
        if (!date && !required) {
            return { valid: true, message: '' };
        }
        
        if (!date && required) {
            return { valid: false, message: 'Tarih gereklidir!' };
        }
        
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return { valid: false, message: 'Geçersiz tarih formatı!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Future date validation
    static validateFutureDate(date, afterDate = null) {
        const validation = this.validateDate(date, true);
        if (!validation.valid) return validation;
        
        const dateObj = new Date(date);
        const compareDate = afterDate ? new Date(afterDate) : new Date();
        
        if (dateObj <= compareDate) {
            return { valid: false, message: 'Tarih gelecekte bir tarih olmalıdır!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Duty type validation
    static validateDutyType(dutyType) {
        if (!dutyType) {
            return { valid: false, message: 'Görev tipi gereklidir!' };
        }
        
        const validTypes = [
            'Araştırma_Görevlisi',
            'Öğretim_Görevlisi',
            'Dr_Öğretim_Üyesi',
            'Doçent',
            'Profesör'
        ];
        
        if (!validTypes.includes(dutyType)) {
            return { valid: false, message: 'Geçersiz görev tipi!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Status validation
    static validateStatus(status) {
        if (!status) {
            return { valid: false, message: 'Durum gereklidir!' };
        }
        
        const validStatuses = ['Aktif', 'Pasif', 'İzinli', 'Emekli'];
        if (!validStatuses.includes(status)) {
            return { valid: false, message: 'Geçersiz durum! (Aktif/Pasif/İzinli/Emekli)' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Department validation
    static validateDepartment(department) {
        if (!department || department.trim() === '') {
            return { valid: false, message: 'Bölüm gereklidir!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Score type validation
    static validateScoreType(scoreType) {
        if (!scoreType) {
            return { valid: false, message: 'Puan tipi gereklidir!' };
        }
        
        const validTypes = ['Bilimsel', 'Eğitim', 'Yönetsel', 'Diğer'];
        if (!validTypes.includes(scoreType)) {
            return { valid: false, message: 'Geçersiz puan tipi!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Username validation
    static validateUsername(username) {
        if (!username || username.trim() === '') {
            return { valid: false, message: 'Kullanıcı adı gereklidir!' };
        }
        
        if (username.length < 3) {
            return { valid: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır!' };
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { valid: false, message: 'Kullanıcı adı sadece harf, rakam ve _ içerebilir!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Password validation
    static validatePassword(password) {
        if (!password || password.trim() === '') {
            return { valid: false, message: 'Şifre gereklidir!' };
        }
        
        if (password.length < 8) {
            return { valid: false, message: 'Şifre en az 8 karakter olmalıdır!' };
        }
        
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Şifre en az bir büyük harf içermelidir!' };
        }
        
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Şifre en az bir küçük harf içermelidir!' };
        }
        
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Şifre en az bir rakam içermelidir!' };
        }
        
        return { valid: true, message: 'Geçerli' };
    }

    // Validate complete person object
    static validatePerson(person) {
        const errors = {};
        
        const tcValidation = this.validateTcNo(person.tc_no);
        if (!tcValidation.valid) errors.tc_no = tcValidation.message;
        
        const nameValidation = this.validateName(person.name, 'İsim');
        if (!nameValidation.valid) errors.name = nameValidation.message;
        
        const surnameValidation = this.validateName(person.surname, 'Soyisim');
        if (!surnameValidation.valid) errors.surname = surnameValidation.message;
        
        if (person.mid_name) {
            const midNameValidation = this.validateName(person.mid_name, 'İkinci isim');
            if (!midNameValidation.valid) errors.mid_name = midNameValidation.message;
        }
        
        if (person.personal_mail) {
            const emailValidation = this.validateEmail(person.personal_mail);
            if (!emailValidation.valid) errors.personal_mail = emailValidation.message;
        }
        
        if (person.gender) {
            const genderValidation = this.validateGender(person.gender);
            if (!genderValidation.valid) errors.gender = genderValidation.message;
        }
        
        const registrValidation = this.validateRegistrNo(person.registr_no);
        if (!registrValidation.valid) errors.registr_no = registrValidation.message;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Validate complete personel object
    static validatePersonel(personel) {
        const errors = {};
        
        const registrValidation = this.validateRegistrNo(personel.registr_no);
        if (!registrValidation.valid) errors.registr_no = registrValidation.message;
        
        const emailValidation = this.validateItuEmail(personel.itu_mail);
        if (!emailValidation.valid) errors.itu_mail = emailValidation.message;
        
        const deptValidation = this.validateDepartment(personel.department);
        if (!deptValidation.valid) errors.department = deptValidation.message;
        
        const dateValidation = this.validateDate(personel.registration_date, true);
        if (!dateValidation.valid) errors.registration_date = dateValidation.message;
        
        const statusValidation = this.validateStatus(personel.status);
        if (!statusValidation.valid) errors.status = statusValidation.message;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Validate academic personel
    static validateAcademicPersonel(academic) {
        const errors = {};
        
        const registrValidation = this.validateRegistrNo(academic.registr_no);
        if (!registrValidation.valid) errors.registr_no = registrValidation.message;
        
        const dutyValidation = this.validateDutyType(academic.duty_type);
        if (!dutyValidation.valid) errors.duty_type = dutyValidation.message;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Validate system admin
    static validateSystemAdmin(admin) {
        const errors = {};
        
        const registrValidation = this.validateRegistrNo(admin.registr_no);
        if (!registrValidation.valid) errors.registr_no = registrValidation.message;
        
        const usernameValidation = this.validateUsername(admin.user_name);
        if (!usernameValidation.valid) errors.user_name = usernameValidation.message;
        
        const passwordValidation = this.validatePassword(admin.encrypted_password);
        if (!passwordValidation.valid) errors.encrypted_password = passwordValidation.message;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Check relational integrity
    static checkPersonelRelation(registr_no) {
        const person = storage.data.persons.find(p => p.registr_no === registr_no);
        if (!person) {
            return {
                valid: false,
                message: `Sicil numarası ${registr_no} ile kayıtlı kişi bulunamadı!`
            };
        }
        return { valid: true, message: '' };
    }

    static checkAcademicRelation(registr_no) {
        const personel = storage.data.personel.find(p => p.registr_no === registr_no);
        if (!personel) {
            return {
                valid: false,
                message: `Sicil numarası ${registr_no} ile kayıtlı personel bulunamadı!`
            };
        }
        return { valid: true, message: '' };
    }
}

// Export for use in other modules
window.Validator = Validator;
