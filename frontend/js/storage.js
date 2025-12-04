// storage.js - Data Management using LocalStorage and JSON

class DataStorage {
    constructor() {
        this.storageKey = 'itu_personel_data';
        this.data = this.loadData();
    }

    // Initialize with empty data structure
    initializeData() {
        return {
            persons: [],
            personel: [],
            academicPersonel: [],
            managementStaff: [],
            systemAdmin: [],
            languageCompensation: [
                { lang_comp_id: 1, letter_score: 'A' },
                { lang_comp_id: 2, letter_score: 'B' },
                { lang_comp_id: 3, letter_score: 'C' }
            ],
            personelLanguageScores: [],
            highAcademicScores: [],
            lowAcademic: [],
            lowAcademicExtensions: [],
            promotions: [],
            managementPromotions: []
        };
    }

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        return this.initializeData();
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Export data as JSON file
    exportToJSON() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `itu_personel_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import data from JSON file
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    
                    // Direct import - already in correct format
                    this.data = {
                        ...this.initializeData(),
                        ...imported
                    };
                    
                    this.saveData();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // CRUD Operations for Person
    addPerson(person) {
        if (this.data.persons.find(p => p.tc_no === person.tc_no)) {
            throw new Error('Bu TC No ile kayıtlı kişi zaten mevcut!');
        }
        this.data.persons.push(person);
        this.saveData();
        return person;
    }

    updatePerson(tc_no, updatedData) {
        const index = this.data.persons.findIndex(p => p.tc_no === tc_no);
        if (index === -1) throw new Error('Kişi bulunamadı!');
        this.data.persons[index] = { ...this.data.persons[index], ...updatedData };
        this.saveData();
        return this.data.persons[index];
    }

    deletePerson(tc_no) {
        const personel = this.data.personel.find(p => p.registr_no === this.getRegistrNoByTc(tc_no));
        if (personel) {
            throw new Error('Bu kişiye ait personel kaydı var, önce personel kaydını siliniz!');
        }
        
        this.data.persons = this.data.persons.filter(p => p.tc_no !== tc_no);
        this.saveData();
    }

    getPersonByTc(tc_no) {
        return this.data.persons.find(p => p.tc_no === tc_no);
    }

    getRegistrNoByTc(tc_no) {
        const person = this.data.persons.find(p => p.tc_no === tc_no);
        return person ? person.registr_no : null;
    }

    // CRUD Operations for Personnel
    addPersonel(personel) {
        if (this.data.personel.find(p => p.registr_no === personel.registr_no)) {
            throw new Error('Bu sicil numarası ile kayıtlı personel zaten mevcut!');
        }
        
        const person = this.data.persons.find(p => p.registr_no === personel.registr_no);
        if (!person) {
            throw new Error('Bu sicil numarasına sahip kişi bulunamadı!');
        }
        
        this.data.personel.push(personel);
        this.saveData();
        return personel;
    }

    updatePersonel(registr_no, updatedData) {
        const index = this.data.personel.findIndex(p => p.registr_no === registr_no);
        if (index === -1) throw new Error('Personel bulunamadı!');
        this.data.personel[index] = { ...this.data.personel[index], ...updatedData };
        this.saveData();
        return this.data.personel[index];
    }

    deletePersonel(registr_no) {
        const academic = this.data.academicPersonel.find(a => a.registr_no === registr_no);
        const management = this.data.managementStaff.find(m => m.registr_no === registr_no);
        const admin = this.data.systemAdmin.find(s => s.registr_no === registr_no);
        
        if (academic || management || admin) {
            throw new Error('Bu personele ait alt kayıtlar var, önce onları siliniz!');
        }
        
        this.data.personel = this.data.personel.filter(p => p.registr_no !== registr_no);
        this.saveData();
    }

    getPersonelByRegistrNo(registr_no) {
        return this.data.personel.find(p => p.registr_no === registr_no);
    }

    // Get all personnel with combined data
    getAllPersonnelWithDetails() {
        return this.data.persons.map(person => {
            const personel = this.data.personel.find(p => p.registr_no === person.registr_no);
            const academic = this.data.academicPersonel.find(a => a.registr_no === person.registr_no);
            const management = this.data.managementStaff.find(m => m.registr_no === person.registr_no);
            
            return {
                ...person,
                ...personel,
                academic,
                management
            };
        }).filter(p => p.itu_mail); // Only return those with personel record
    }

    // CRUD for Academic Personnel
    addAcademicPersonel(academic) {
        if (this.data.academicPersonel.find(a => a.registr_no === academic.registr_no)) {
            throw new Error('Bu sicil numarasına ait akademik personel kaydı zaten mevcut!');
        }
        this.data.academicPersonel.push(academic);
        this.saveData();
        return academic;
    }

    // CRUD for Low Academic
    addLowAcademic(lowAcademic) {
        if (this.data.lowAcademic.find(la => la.registr_no === lowAcademic.registr_no)) {
            throw new Error('Bu sicil numarasına ait düşük seviye akademik personel kaydı zaten mevcut!');
        }
        this.data.lowAcademic.push(lowAcademic);
        this.saveData();
        return lowAcademic;
    }

    // CRUD for Management Staff
    addManagementStaff(management) {
        if (this.data.managementStaff.find(m => m.registr_no === management.registr_no)) {
            throw new Error('Bu sicil numarasına ait yönetim personeli kaydı zaten mevcut!');
        }
        this.data.managementStaff.push(management);
        this.saveData();
        return management;
    }

    // CRUD for Language Scores
    addLanguageScore(langScore) {
        this.data.personelLanguageScores.push(langScore);
        this.saveData();
        return langScore;
    }

    getLanguageScoresForPersonnel(registr_no) {
        return this.data.personelLanguageScores
            .filter(ls => ls.registr_no === registr_no)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // CRUD for High Academic Scores
    addHighAcademicScore(score) {
        this.data.highAcademicScores.push(score);
        this.saveData();
        return score;
    }

    getHighAcademicScoresForPersonnel(registr_no) {
        return this.data.highAcademicScores
            .filter(s => s.registr_no === registr_no)
            .sort((a, b) => new Date(b.score_date) - new Date(a.score_date));
    }

    // CRUD for Low Academic Extensions
    addLowAcademicExtension(extension) {
        this.data.lowAcademicExtensions.push(extension);
        this.saveData();
        return extension;
    }

    getLowAcademicExtensionsForPersonnel(registr_no) {
        return this.data.lowAcademicExtensions
            .filter(e => e.registr_no === registr_no)
            .sort((a, b) => new Date(b.ext_date) - new Date(a.ext_date));
    }

    // CRUD for Promotions
    addPromotion(promotion) {
        this.data.promotions.push(promotion);
        this.saveData();
        return promotion;
    }

    addManagementPromotion(managementPromotion) {
        this.data.managementPromotions.push(managementPromotion);
        this.saveData();
        return managementPromotion;
    }

    // Clear all data
    clearAllData() {
        this.data = this.initializeData();
        this.saveData();
    }

    // Get statistics
    getStatistics() {
        return {
            totalPersons: this.data.persons.length,
            totalPersonel: this.data.personel.length,
            academicPersonel: this.data.academicPersonel.length,
            lowAcademic: this.data.lowAcademic.length,
            highAcademic: this.data.academicPersonel.filter(a => a.duty_type === 'HIGH_ACADEMIC').length,
            managementStaff: this.data.managementStaff.length,
            withLanguageCompensation: new Set(this.data.personelLanguageScores.map(s => s.registr_no)).size
        };
    }
}
