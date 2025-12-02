// app.js - Main Application Logic

class PersonelApp {
    constructor() {
        this.currentTab = 'persons';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.renderCurrentTab();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Toolbar buttons
        document.getElementById('addNewBtn').addEventListener('click', () => this.showAddModal());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Notifications
        const notifBtn = document.getElementById('notificationsBtn');
        const notifPanel = document.getElementById('notificationsPanel');
        
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                notifPanel.style.display = notifPanel.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Close notifications when clicking outside
        window.addEventListener('click', (e) => {
            if (notifPanel && notifPanel.style.display === 'block' && 
                !notifPanel.contains(e.target) && e.target !== notifBtn) {
                notifPanel.style.display = 'none';
            }
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => UI.hideModal());
        window.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                UI.hideModal();
            }
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileImport(e));
    }

    loadInitialData() {
        // Don't load sample data - start with clean tables
        // Users can import the processed Excel data using the import button
        if (storage.data.persons.length === 0) {
            console.log('No data loaded. Please import frontend_data.json file.');
        }
    }

    loadSampleData() {
        // This method is now deprecated - users should import real data
        alert('Please use the "JSON Yükle" button to import the frontend_data.json file generated from Excel data.');
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.renderCurrentTab();
    }

    checkNotifications() {
        const notifications = BusinessLogic.generateNotifications(storage.data);
        const countBadge = document.getElementById('notificationCount');
        const listContainer = document.getElementById('notificationsList');
        
        if (notifications.length > 0) {
            countBadge.textContent = notifications.length;
            countBadge.style.display = 'inline-block';
            
            listContainer.innerHTML = notifications.map(n => `
                <div class="notification-item ${n.type}">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-message">${n.message}</div>
                </div>
            `).join('');
        } else {
            countBadge.style.display = 'none';
            listContainer.innerHTML = '<div class="notification-item">Bildirim bulunmamaktadır.</div>';
        }
    }

    renderCurrentTab() {
        this.checkNotifications();
        const containerMap = {
            'persons': 'personsCards',
            'research-assistant': 'researchAssistantCards',
            'instructor': 'instructorCards',
            'doctor-lecturer': 'doctorLecturerCards',
            'associate-prof': 'associateProfCards',
            'professor': 'professorCards',
            'administrative': 'administrativeCards',
            'system-admin': 'systemAdminCards'
        };

        const container = document.getElementById(containerMap[this.currentTab]);
        container.innerHTML = '';

        let data = [];

        switch (this.currentTab) {
            case 'persons':
                data = storage.getAllPersons();
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Henüz personel kaydı bulunmamaktadır.');
                } else {
                    data.forEach(person => {
                        container.appendChild(UI.createPersonCard(person));
                    });
                }
                break;

            case 'research-assistant':
                data = storage.getAcademicStaffByType('Araştırma_Görevlisi');
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Araştırma Görevlisi kaydı bulunmamaktadır.');
                } else {
                    data.forEach(academic => {
                        container.appendChild(UI.createAcademicCard(academic));
                    });
                }
                break;

            case 'instructor':
                data = storage.getAcademicStaffByType('Öğretim_Görevlisi');
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Öğretim Görevlisi kaydı bulunmamaktadır.');
                } else {
                    data.forEach(academic => {
                        container.appendChild(UI.createAcademicCard(academic));
                    });
                }
                break;

            case 'doctor-lecturer':
                data = storage.getAcademicStaffByType('Dr_Öğretim_Üyesi');
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Dr. Öğretim Üyesi kaydı bulunmamaktadır.');
                } else {
                    data.forEach(academic => {
                        container.appendChild(UI.createAcademicCard(academic));
                    });
                }
                break;

            case 'associate-prof':
                data = storage.getAcademicStaffByType('Doçent');
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Doçent kaydı bulunmamaktadır.');
                } else {
                    data.forEach(academic => {
                        container.appendChild(UI.createAcademicCard(academic));
                    });
                }
                break;

            case 'professor':
                data = storage.getAcademicStaffByType('Profesör');
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Profesör kaydı bulunmamaktadır.');
                } else {
                    data.forEach(academic => {
                        container.appendChild(UI.createAcademicCard(academic));
                    });
                }
                break;

            case 'administrative':
                data = storage.getAdministrativeStaff();
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'İdari personel kaydı bulunmamaktadır.');
                } else {
                    data.forEach(admin => {
                        container.appendChild(UI.createAdministrativeCard(admin));
                    });
                }
                break;

            case 'system-admin':
                data = storage.getSystemAdmins();
                if (data.length === 0) {
                    UI.renderEmptyState(container, 'Sistem yöneticisi kaydı bulunmamaktadır.');
                } else {
                    data.forEach(admin => {
                        container.appendChild(UI.createSystemAdminCard(admin));
                    });
                }
                break;
        }
    }

    showAddModal() {
        let formContent = '';

        if (this.currentTab === 'persons') {
            formContent = this.getPersonForm();
        } else if (this.currentTab.includes('assistant') || this.currentTab.includes('instructor') || 
                   this.currentTab.includes('lecturer') || this.currentTab.includes('prof')) {
            formContent = this.getAcademicForm();
        } else if (this.currentTab === 'administrative') {
            formContent = this.getAdministrativeForm();
        } else if (this.currentTab === 'system-admin') {
            formContent = this.getSystemAdminForm();
        }

        formContent += `
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">İptal</button>
                <button type="button" class="btn btn-primary" onclick="app.handleFormSubmit()">Kaydet</button>
            </div>
        `;

        UI.showModal('Yeni Kayıt Ekle', formContent);
    }

    getPersonForm(data = {}) {
        return `
            <form id="dataForm">
                ${UI.createFormField({ name: 'tc_no', label: 'TC Kimlik No', required: true, value: data.tc_no || '' })}
                
                <div class="form-row">
                    ${UI.createFormField({ name: 'name', label: 'İsim', required: true, value: data.name || '' })}
                    ${UI.createFormField({ name: 'mid_name', label: 'İkinci İsim', value: data.mid_name || '' })}
                </div>
                
                ${UI.createFormField({ name: 'surname', label: 'Soyisim', required: true, value: data.surname || '' })}
                ${UI.createFormField({ name: 'personal_mail', label: 'Kişisel Email', type: 'email', value: data.personal_mail || '' })}
                
                <div class="form-row">
                    ${UI.createFormField({ 
                        name: 'gender', 
                        label: 'Cinsiyet', 
                        type: 'select',
                        options: [
                            { value: 'Erkek', label: 'Erkek' },
                            { value: 'Kadın', label: 'Kadın' }
                        ],
                        value: data.gender || ''
                    })}
                    ${UI.createFormField({ name: 'registr_no', label: 'Sicil No', type: 'number', required: true, value: data.registr_no || '' })}
                </div>
            </form>
        `;
    }

    getAcademicForm(data = {}) {
        const dutyTypeMap = {
            'research-assistant': 'Araştırma_Görevlisi',
            'instructor': 'Öğretim_Görevlisi',
            'doctor-lecturer': 'Dr_Öğretim_Üyesi',
            'associate-prof': 'Doçent',
            'professor': 'Profesör'
        };

        const currentDutyType = data.duty_type || dutyTypeMap[this.currentTab] || '';
        let extraFields = '';

        if (currentDutyType === 'Araştırma_Görevlisi') {
            extraFields = `
                <div class="form-row">
                    ${UI.createFormField({ 
                        name: 'appointment_type', 
                        label: 'Atanma Maddesi', 
                        type: 'select',
                        options: [
                            { value: '33a', label: '33a' },
                            { value: '50d', label: '50d' }
                        ],
                        value: data.appointment_type || ''
                    })}
                    ${UI.createFormField({ 
                        name: 'education_level', 
                        label: 'Eğitim Düzeyi', 
                        type: 'select',
                        options: [
                            { value: 'master', label: 'Yüksek Lisans' },
                            { value: 'phd', label: 'Doktora' }
                        ],
                        value: data.education_level || ''
                    })}
                </div>
            `;
        }

        return `
            <form id="dataForm">
                ${UI.createFormField({ name: 'registr_no', label: 'Sicil No', type: 'number', required: true, value: data.registr_no || '' })}
                
                ${UI.createFormField({ 
                    name: 'duty_type', 
                    label: 'Görev Tipi', 
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'Araştırma_Görevlisi', label: 'Araştırma Görevlisi' },
                        { value: 'Öğretim_Görevlisi', label: 'Öğretim Görevlisi' },
                        { value: 'Dr_Öğretim_Üyesi', label: 'Dr. Öğretim Üyesi' },
                        { value: 'Doçent', label: 'Doçent' },
                        { value: 'Profesör', label: 'Profesör' }
                    ],
                    value: currentDutyType
                })}
                
                ${extraFields}
                
                <p style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 6px; font-size: 0.9em;">
                    ℹ️ Not: Akademik personel eklemeden önce kişi ve personel kayıtlarının oluşturulmuş olması gerekmektedir.
                </p>
            </form>
        `;
    }

    getAdministrativeForm(data = {}) {
        return `
            <form id="dataForm">
                ${UI.createFormField({ name: 'registr_no', label: 'Sicil No', type: 'number', required: true, value: data.registr_no || '' })}
                ${UI.createFormField({ name: 'itu_mail', label: 'İTÜ Email', type: 'email', required: true, value: data.itu_mail || '' })}
                ${UI.createFormField({ name: 'department', label: 'Bölüm', required: true, value: data.department || '' })}
                ${UI.createFormField({ name: 'registration_date', label: 'Kayıt Tarihi', type: 'date', required: true, value: data.registration_date || '' })}
                
                ${UI.createFormField({ 
                    name: 'status', 
                    label: 'Durum', 
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'Aktif', label: 'Aktif' },
                        { value: 'Pasif', label: 'Pasif' },
                        { value: 'İzinli', label: 'İzinli' },
                        { value: 'Emekli', label: 'Emekli' }
                    ],
                    value: data.status || 'Aktif'
                })}
                
                <p style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 6px; font-size: 0.9em;">
                    ℹ️ Not: Personel eklemeden önce ilgili kişi kaydının oluşturulmuş olması gerekmektedir.
                </p>
            </form>
        `;
    }

    getSystemAdminForm(data = {}) {
        return `
            <form id="dataForm">
                ${UI.createFormField({ name: 'registr_no', label: 'Sicil No', type: 'number', required: true, value: data.registr_no || '' })}
                ${UI.createFormField({ name: 'user_name', label: 'Kullanıcı Adı', required: true, value: data.user_name || '' })}
                ${UI.createFormField({ name: 'encrypted_password', label: 'Şifre', type: 'password', required: true, value: data.encrypted_password || '' })}
                
                <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 6px; font-size: 0.9em;">
                    ⚠️ Şifre gereksinimleri: En az 8 karakter, en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.
                </p>
            </form>
        `;
    }

    handleFormSubmit() {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            if (this.currentTab === 'persons') {
                const validation = Validator.validatePerson(data);
                if (!validation.valid) {
                    UI.displayErrors(validation.errors);
                    UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
                    return;
                }
                storage.addPerson(data);
                UI.showAlert('Kişi başarıyla eklendi!', 'success');
            } else if (this.currentTab.includes('assistant') || this.currentTab.includes('instructor') || 
                       this.currentTab.includes('lecturer') || this.currentTab.includes('prof')) {
                const validation = Validator.validateAcademicPersonel(data);
                if (!validation.valid) {
                    UI.displayErrors(validation.errors);
                    UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
                    return;
                }
                
                const relationCheck = Validator.checkAcademicRelation(parseInt(data.registr_no));
                if (!relationCheck.valid) {
                    UI.showAlert(relationCheck.message, 'error');
                    return;
                }
                
                storage.addAcademicPersonel(data);
                UI.showAlert('Akademik personel başarıyla eklendi!', 'success');
            } else if (this.currentTab === 'administrative') {
                const validation = Validator.validatePersonel(data);
                if (!validation.valid) {
                    UI.displayErrors(validation.errors);
                    UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
                    return;
                }
                
                const relationCheck = Validator.checkPersonelRelation(parseInt(data.registr_no));
                if (!relationCheck.valid) {
                    UI.showAlert(relationCheck.message, 'error');
                    return;
                }
                
                storage.addPersonel(data);
                UI.showAlert('Personel başarıyla eklendi!', 'success');
            } else if (this.currentTab === 'system-admin') {
                const validation = Validator.validateSystemAdmin(data);
                if (!validation.valid) {
                    UI.displayErrors(validation.errors);
                    UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
                    return;
                }
                
                storage.data.systemAdmin.push(data);
                storage.saveData();
                UI.showAlert('Sistem yöneticisi başarıyla eklendi!', 'success');
            }

            UI.hideModal();
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    editPerson(tc_no) {
        const person = storage.getPersonByTc(tc_no);
        if (!person) {
            UI.showAlert('Kişi bulunamadı!', 'error');
            return;
        }

        const formContent = this.getPersonForm(person) + `
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">İptal</button>
                <button type="button" class="btn btn-primary" onclick="app.handlePersonUpdate('${tc_no}')">Güncelle</button>
            </div>
        `;

        UI.showModal('Kişi Bilgilerini Düzenle', formContent);
    }

    handlePersonUpdate(tc_no) {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const validation = Validator.validatePerson(data);
        if (!validation.valid) {
            UI.displayErrors(validation.errors);
            UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
            return;
        }

        try {
            storage.updatePerson(tc_no, data);
            UI.showAlert('Kişi bilgileri güncellendi!', 'success');
            UI.hideModal();
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    deletePerson(tc_no) {
        if (!confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            storage.deletePerson(tc_no);
            UI.showAlert('Kişi başarıyla silindi!', 'success');
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    editAcademic(registr_no) {
        const academic = storage.data.academicPersonel.find(a => a.registr_no === registr_no);
        if (!academic) {
            UI.showAlert('Akademik personel bulunamadı!', 'error');
            return;
        }

        const formContent = this.getAcademicForm(academic) + `
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">İptal</button>
                <button type="button" class="btn btn-primary" onclick="app.handleAcademicUpdate(${registr_no})">Güncelle</button>
            </div>
        `;

        UI.showModal('Akademik Personel Bilgilerini Düzenle', formContent);
    }

    handleAcademicUpdate(registr_no) {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const validation = Validator.validateAcademicPersonel(data);
        if (!validation.valid) {
            UI.displayErrors(validation.errors);
            UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
            return;
        }

        try {
            storage.updateAcademicPersonel(registr_no, data);
            UI.showAlert('Akademik personel bilgileri güncellendi!', 'success');
            UI.hideModal();
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    deleteAcademic(registr_no) {
        if (!confirm('Bu akademik personeli silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            storage.deleteAcademicPersonel(registr_no);
            UI.showAlert('Akademik personel başarıyla silindi!', 'success');
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    editAdministrative(registr_no) {
        const personel = storage.data.personel.find(p => p.registr_no === registr_no);
        if (!personel) {
            UI.showAlert('Personel bulunamadı!', 'error');
            return;
        }

        const formContent = this.getAdministrativeForm(personel) + `
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">İptal</button>
                <button type="button" class="btn btn-primary" onclick="app.handleAdministrativeUpdate(${registr_no})">Güncelle</button>
            </div>
        `;

        UI.showModal('İdari Personel Bilgilerini Düzenle', formContent);
    }

    handleAdministrativeUpdate(registr_no) {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const validation = Validator.validatePersonel(data);
        if (!validation.valid) {
            UI.displayErrors(validation.errors);
            UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
            return;
        }

        try {
            storage.updatePersonel(registr_no, data);
            UI.showAlert('İdari personel bilgileri güncellendi!', 'success');
            UI.hideModal();
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    deleteAdministrative(registr_no) {
        if (!confirm('Bu idari personeli silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            storage.deletePersonel(registr_no);
            UI.showAlert('İdari personel başarıyla silindi!', 'success');
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    editSystemAdmin(registr_no) {
        const admin = storage.data.systemAdmin.find(a => a.registr_no === registr_no);
        if (!admin) {
            UI.showAlert('Sistem yöneticisi bulunamadı!', 'error');
            return;
        }

        const formContent = this.getSystemAdminForm(admin) + `
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="UI.hideModal()">İptal</button>
                <button type="button" class="btn btn-primary" onclick="app.handleSystemAdminUpdate(${registr_no})">Güncelle</button>
            </div>
        `;

        UI.showModal('Sistem Yöneticisi Bilgilerini Düzenle', formContent);
    }

    handleSystemAdminUpdate(registr_no) {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const validation = Validator.validateSystemAdmin(data);
        if (!validation.valid) {
            UI.displayErrors(validation.errors);
            UI.showAlert('Lütfen form hatalarını düzeltin!', 'error');
            return;
        }

        try {
            const index = storage.data.systemAdmin.findIndex(a => a.registr_no === registr_no);
            if (index !== -1) {
                storage.data.systemAdmin[index] = { ...storage.data.systemAdmin[index], ...data };
                storage.saveData();
                UI.showAlert('Sistem yöneticisi bilgileri güncellendi!', 'success');
                UI.hideModal();
                this.renderCurrentTab();
            }
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    deleteSystemAdmin(registr_no) {
        if (!confirm('Bu sistem yöneticisini silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            storage.data.systemAdmin = storage.data.systemAdmin.filter(a => a.registr_no !== registr_no);
            storage.saveData();
            UI.showAlert('Sistem yöneticisi başarıyla silindi!', 'success');
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert(error.message, 'error');
        }
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        // Implement search filtering
        // For simplicity, we'll just re-render
        this.renderCurrentTab();
    }

    exportData() {
        storage.exportToJSON();
        UI.showAlert('Veriler JSON dosyasına aktarıldı!', 'success');
    }

    importData() {
        document.getElementById('fileInput').click();
    }

    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await storage.importFromJSON(file);
            UI.showAlert('Veriler başarıyla yüklendi!', 'success');
            this.renderCurrentTab();
        } catch (error) {
            UI.showAlert('Veri yükleme hatası: ' + error.message, 'error');
        }

        // Reset file input
        event.target.value = '';
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PersonelApp();
});
