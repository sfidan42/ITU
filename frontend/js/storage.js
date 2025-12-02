// storage.js - Data Management using LocalStorage and JSON

class DataStorage {
    constructor() {
        this.storageKey = 'itu_personel_data';
        this.data = this.loadData();
    }

    // Initialize with empty data structure (no placeholder data)
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
                    
                    // Check if it's the processed format from our Excel processor
                    if (imported.persons && Array.isArray(imported.persons)) {
                        // Direct import - already in correct format
                        this.data = {
                            ...this.initializeData(),
                            ...imported
                        };
                    } else if (imported.personnel_data) {
                        // Import from processed_personnel_data.json format
                        // Merge all sheets data
                        const mergedData = this.initializeData();
                        
                        for (const sheetName in imported.personnel_data) {
                            const sheetData = imported.personnel_data[sheetName];
                            if (sheetData.persons) mergedData.persons.push(...sheetData.persons);
                            if (sheetData.personel) mergedData.personel.push(...sheetData.personel);
                            if (sheetData.academicPersonel) mergedData.academicPersonel.push(...sheetData.academicPersonel);
                        }
                        
                        // Add language compensation data
                        if (imported.language_compensation_data) {
                            if (imported.language_compensation_data.language_compensation) {
                                mergedData.languageCompensation = imported.language_compensation_data.language_compensation;
                            }
                            if (imported.language_compensation_data.sheets_data) {
                                for (const sheetName in imported.language_compensation_data.sheets_data) {
                                    mergedData.personelLanguageScores.push(...imported.language_compensation_data.sheets_data[sheetName]);
                                }
                            }
                        }
                        
                        // Remove duplicates
                        mergedData.persons = Array.from(new Map(mergedData.persons.map(p => [p.tc_no, p])).values());
                        mergedData.personel = Array.from(new Map(mergedData.personel.map(p => [p.registr_no, p])).values());
                        mergedData.academicPersonel = Array.from(new Map(mergedData.academicPersonel.map(p => [p.registr_no, p])).values());
                        
                        this.data = mergedData;
                    } else {
                        // Unknown format
                        throw new Error('Unrecognized JSON format');
                    }
                    
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
        // Check if TC number already exists
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
        // Check for related personel record
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

    // CRUD Operations for Personel
    addPersonel(personel) {
        // Check if registr_no already exists
        if (this.data.personel.find(p => p.registr_no === personel.registr_no)) {
            throw new Error('Bu sicil numarası ile kayıtlı personel zaten mevcut!');
        }
        
        // Verify person exists
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
        // Check for related records
        const academic = this.data.academicPersonel.find(a => a.registr_no === registr_no);
        const management = this.data.managementStaff.find(m => m.registr_no === registr_no);
        const admin = this.data.systemAdmin.find(s => s.registr_no === registr_no);
        
        if (academic || management || admin) {
            throw new Error('Bu personele ait alt kayıtlar var, önce onları siliniz!');
        }
        
        this.data.personel = this.data.personel.filter(p => p.registr_no !== registr_no);
        this.saveData();
    }

    // Academic Personnel Operations
    addAcademicPersonel(academic) {
        // Verify personel exists
        if (!this.data.personel.find(p => p.registr_no === academic.registr_no)) {
            throw new Error('Bu sicil numarasına sahip personel bulunamadı!');
        }
        
        if (this.data.academicPersonel.find(a => a.registr_no === academic.registr_no)) {
            throw new Error('Bu sicil numarası ile kayıtlı akademik personel zaten mevcut!');
        }
        
        this.data.academicPersonel.push(academic);
        this.saveData();
        return academic;
    }

    updateAcademicPersonel(registr_no, updatedData) {
        const index = this.data.academicPersonel.findIndex(a => a.registr_no === registr_no);
        if (index === -1) throw new Error('Akademik personel bulunamadı!');
        this.data.academicPersonel[index] = { ...this.data.academicPersonel[index], ...updatedData };
        this.saveData();
        return this.data.academicPersonel[index];
    }

    deleteAcademicPersonel(registr_no) {
        this.data.academicPersonel = this.data.academicPersonel.filter(a => a.registr_no !== registr_no);
        this.data.highAcademicScores = this.data.highAcademicScores.filter(s => s.registr_no !== registr_no);
        this.data.lowAcademic = this.data.lowAcademic.filter(l => l.registr_no !== registr_no);
        this.saveData();
    }

    // Get combined view data
    getAllPersons() {
        return this.data.persons.map(person => {
            const personel = this.data.personel.find(p => p.registr_no === person.registr_no);
            return {
                ...person,
                personel: personel || null
            };
        });
    }

    getAcademicStaffByType(dutyType = null) {
        let academics = this.data.academicPersonel;
        
        if (dutyType) {
            academics = academics.filter(a => a.duty_type === dutyType);
        }
        
        return academics.map(academic => {
            const personel = this.data.personel.find(p => p.registr_no === academic.registr_no);
            const person = personel ? this.data.persons.find(p => p.registr_no === personel.registr_no) : null;
            const highScores = this.data.highAcademicScores.filter(s => s.registr_no === academic.registr_no);
            const lowAcademic = this.data.lowAcademic.find(l => l.registr_no === academic.registr_no);
            const extensions = lowAcademic ? 
                this.data.lowAcademicExtensions.filter(e => e.registr_no === lowAcademic.registr_no) : [];
            
            const languageScores = person ? this.data.personelLanguageScores.filter(s => s.tc_no === person.tc_no) : [];

            return {
                ...academic,
                personel,
                person,
                high_scores: highScores,
                duty_extensions: extensions,
                language_scores: languageScores
            };
        });
    }

    getAdministrativeStaff() {
        // Filter out academic personel
        const academicRegNos = this.data.academicPersonel.map(a => a.registr_no);
        
        return this.data.personel
            .filter(p => !academicRegNos.includes(p.registr_no))
            .map(personel => {
                const person = this.data.persons.find(p => p.registr_no === personel.registr_no);
                const management = this.data.managementStaff.find(m => m.registr_no === personel.registr_no);
                const promotions = management ? 
                    this.data.managementPromotions
                        .filter(mp => mp.registr_no === management.registr_no)
                        .map(mp => this.data.promotions.find(p => p.prom_id === mp.prom_id))
                        .filter(p => p) : [];
                
                const languageScores = person ? this.data.personelLanguageScores.filter(s => s.tc_no === person.tc_no) : [];

                return {
                    ...personel,
                    person,
                    management_staff: management ? {
                        ...management,
                        promotions
                    } : null,
                    language_scores: languageScores
                };
            });
    }

    getSystemAdmins() {
        return this.data.systemAdmin.map(admin => {
            const personel = this.data.personel.find(p => p.registr_no === admin.registr_no);
            const person = personel ? this.data.persons.find(p => p.registr_no === personel.registr_no) : null;
            
            return {
                ...admin,
                personel,
                person
            };
        });
    }

    // Language compensation operations
    addLanguageScore(score) {
        const key = `${score.registr_no}_${score.date}`;
        const exists = this.data.personelLanguageScores.find(s => 
            s.registr_no === score.registr_no && s.date === score.date
        );
        
        if (exists) {
            throw new Error('Bu tarihte bu personel için dil puanı zaten mevcut!');
        }
        
        this.data.personelLanguageScores.push(score);
        this.saveData();
        return score;
    }

    getLanguageScoresByRegistr(registr_no) {
        return this.data.personelLanguageScores
            .filter(s => s.registr_no === registr_no)
            .map(s => {
                const comp = this.data.languageCompensation.find(c => c.lang_comp_id === s.lang_comp_id);
                return {
                    ...s,
                    compensation: comp
                };
            });
    }

    // High academic scores
    addHighAcademicScore(score) {
        const exists = this.data.highAcademicScores.find(s => 
            s.registr_no === score.registr_no && s.score_date === score.score_date
        );
        
        if (exists) {
            throw new Error('Bu tarihte bu personel için akademik puan zaten mevcut!');
        }
        
        this.data.highAcademicScores.push(score);
        this.saveData();
        return score;
    }

    // Search functionality
    search(query) {
        query = query.toLowerCase();
        
        return {
            persons: this.data.persons.filter(p => 
                p.name?.toLowerCase().includes(query) ||
                p.surname?.toLowerCase().includes(query) ||
                p.tc_no?.includes(query) ||
                p.personal_mail?.toLowerCase().includes(query) ||
                p.registr_no?.toString().includes(query)
            )
        };
    }
}

// Initialize global storage instance
const storage = new DataStorage();
