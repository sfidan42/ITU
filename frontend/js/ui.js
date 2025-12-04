// ui.js - UI Rendering and Display Module

class PersonnelUI {
    constructor(storage) {
        this.storage = storage;
        this.currentView = 'all';
        this.searchTerm = '';
        this.departmentFilter = '';
        this.statusFilter = '';
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.render();
            });
        }

        // Department filter
        const deptFilter = document.getElementById('departmentFilter');
        if (deptFilter) {
            deptFilter.addEventListener('change', (e) => {
                this.departmentFilter = e.target.value;
                this.render();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.render();
            });
        }
    }

    render() {
        // Only show statistics on "all" view
        if (this.currentView === 'all') {
            this.renderStatistics();
            document.getElementById('statsContainer').style.display = 'grid';
        } else {
            document.getElementById('statsContainer').style.display = 'none';
        }
        
        this.renderDepartmentFilter();
        this.renderPersonnelCards();
    }

    renderStatistics() {
        const stats = this.calculateStatistics();
        const container = document.getElementById('statsContainer');
        
        container.innerHTML = `
            <div class="stat-card blue">
                <h3>Toplam Personel</h3>
                <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card green">
                <h3>Araştırma Görevlisi</h3>
                <div class="stat-value">${stats.arastirmaGorevlisi}</div>
            </div>
            <div class="stat-card orange">
                <h3>Öğretim Görevlisi</h3>
                <div class="stat-value">${stats.ogretimGorevlisi}</div>
            </div>
            <div class="stat-card purple">
                <h3>Dr. Öğretim Üyesi</h3>
                <div class="stat-value">${stats.drOgretimUyesi}</div>
            </div>
            <div class="stat-card blue">
                <h3>Doçent</h3>
                <div class="stat-value">${stats.docent}</div>
            </div>
            <div class="stat-card green">
                <h3>Profesör</h3>
                <div class="stat-value">${stats.profesor}</div>
            </div>
            <div class="stat-card orange">
                <h3>İdari Personel</h3>
                <div class="stat-value">${stats.idari}</div>
            </div>
        `;
    }

    calculateStatistics() {
        const personnelList = this.getFilteredPersonnel();
        const allPersonnel = this.getAllPersonnel();
        
        return {
            total: allPersonnel.length,
            arastirmaGorevlisi: allPersonnel.filter(p => p.position === 'Araştırma Görevlisi').length,
            ogretimGorevlisi: allPersonnel.filter(p => p.position === 'Öğretim Görevlisi').length,
            drOgretimUyesi: allPersonnel.filter(p => p.position === 'Dr. Öğretim Üyesi').length,
            docent: allPersonnel.filter(p => p.position === 'Doçent').length,
            profesor: allPersonnel.filter(p => p.position === 'Profesör').length,
            idari: allPersonnel.filter(p => p.position === 'İdari Personel' || !p.isAcademic).length
        };
    }

    renderDepartmentFilter() {
        const deptFilter = document.getElementById('departmentFilter');
        if (!deptFilter) return;

        // Get unique departments
        const departments = new Set();
        this.storage.data.personel.forEach(p => {
            if (p.department) departments.add(p.department);
        });

        // Keep current selection
        const currentValue = deptFilter.value;
        
        deptFilter.innerHTML = '<option value="">Tüm Bölümler</option>';
        Array.from(departments).sort().forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            if (dept === currentValue) option.selected = true;
            deptFilter.appendChild(option);
        });
    }

    renderPersonnelCards() {
        const container = document.getElementById('cardsContainer');
        const emptyState = document.getElementById('emptyState');
        const personnelList = this.getFilteredPersonnel();

        console.log('Rendering cards:', personnelList.length, 'personnel');
        console.log('Current view:', this.currentView);
        
        if (personnelList.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';
        
        container.innerHTML = personnelList.map(p => this.createPersonnelCard(p)).join('');
    }

    getFilteredPersonnel() {
        const allPersonnel = this.getAllPersonnel();
        
        return allPersonnel.filter(p => {
            // View filter
            if (this.currentView !== 'all') {
                const viewMap = {
                    'arastirma-gorevlisi': 'Araştırma Görevlisi',
                    'ogretim-gorevlisi': 'Öğretim Görevlisi',
                    'dr-ogretim-uyesi': 'Dr. Öğretim Üyesi',
                    'docent': 'Doçent',
                    'profesor': 'Profesör',
                    'idari': 'İdari Personel'
                };
                if (p.position !== viewMap[this.currentView]) return false;
            }

            // Search filter
            if (this.searchTerm) {
                const searchFields = [
                    p.fullName,
                    p.tcNo,
                    p.registrNo?.toString(),
                    p.ituMail
                ].filter(Boolean).join(' ').toLowerCase();
                
                if (!searchFields.includes(this.searchTerm)) return false;
            }

            // Department filter
            if (this.departmentFilter && p.department !== this.departmentFilter) {
                return false;
            }

            // Status filter
            if (this.statusFilter && p.status !== this.statusFilter) {
                return false;
            }

            return true;
        });
    }

    getAllPersonnel() {
        const result = [];
        
        this.storage.data.persons.forEach(person => {
            const personnel = this.storage.data.personel.find(p => p.registr_no === person.registr_no);
            if (!personnel) return;

            const academic = this.storage.data.academicPersonel.find(a => a.registr_no === person.registr_no);
            const management = this.storage.data.managementStaff.find(m => m.registr_no === person.registr_no);
            
            const fullName = [person.name, person.mid_name, person.surname].filter(Boolean).join(' ');
            
            let position = 'İdari Personel';
            let positionType = 'idari';
            let isAcademic = false;
            let details = {};

            if (academic) {
                isAcademic = true;
                if (academic.duty_type === 'LOW_ACADEMIC') {
                    const lowAc = this.storage.data.lowAcademic.find(la => la.registr_no === person.registr_no);
                    
                    // Determine if Araştırma Görevlisi or Öğretim Görevlisi
                    // Based on appointment_clause
                    if (lowAc?.appointment_clause) {
                        position = 'Araştırma Görevlisi';
                        positionType = 'arastirma';
                        details = {
                            appointmentClause: lowAc.appointment_clause,
                            degreeLevel: lowAc.degree_level,
                            lastDutyExtDate: lowAc.last_duty_ext_date
                        };
                    } else {
                        position = 'Öğretim Görevlisi';
                        positionType = 'ogretim';
                        details = {
                            lastDutyExtDate: lowAc?.last_duty_ext_date
                        };
                    }
                } else if (academic.duty_type === 'HIGH_ACADEMIC') {
                    const scores = this.storage.data.highAcademicScores.filter(s => s.registr_no === person.registr_no);
                    
                    // Determine position from score types
                    if (scores.some(s => s.score_type?.toLowerCase().includes('profesör'))) {
                        position = 'Profesör';
                        positionType = 'profesor';
                    } else if (scores.some(s => s.score_type?.toLowerCase().includes('doçent'))) {
                        position = 'Doçent';
                        positionType = 'docent';
                    } else {
                        position = 'Dr. Öğretim Üyesi';
                        positionType = 'dr-ogretim';
                    }
                    
                    details = {
                        scores: scores
                    };
                }
            } else if (management) {
                position = 'İdari Personel';
                positionType = 'idari';
                details = {
                    title: management.title
                };
            }

            // Get language scores
            const langScores = this.storage.data.personelLanguageScores
                .filter(ls => ls.registr_no === person.registr_no)
                .map(ls => {
                    const comp = this.storage.data.languageCompensation.find(lc => lc.lang_comp_id === ls.lang_comp_id);
                    return {
                        date: ls.date,
                        score: comp?.letter_score || 'N/A'
                    };
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            result.push({
                tcNo: person.tc_no,
                registrNo: person.registr_no,
                fullName,
                name: person.name,
                midName: person.mid_name,
                surname: person.surname,
                personalMail: person.personal_mail,
                gender: person.gender,
                ituMail: personnel.itu_mail,
                department: personnel.department,
                registrationDate: personnel.registration_date,
                status: personnel.status,
                position,
                positionType,
                isAcademic,
                details,
                langScores
            });
        });

        return result;
    }

    createPersonnelCard(person) {
        const badgeClass = `badge-${person.positionType}`;
        const statusBadge = person.status === 'Aktif' ? 'badge-aktif' : 'badge-pasif';
        
        let detailsHTML = '';
        
        if (person.details.appointmentClause) {
            detailsHTML += `
                <div class="info-row">
                    <span class="info-label">Atanma Maddesi:</span>
                    <span class="info-value">${person.details.appointmentClause}</span>
                </div>
            `;
        }
        
        if (person.details.degreeLevel) {
            detailsHTML += `
                <div class="info-row">
                    <span class="info-label">Eğitim Seviyesi:</span>
                    <span class="info-value">${person.details.degreeLevel}</span>
                </div>
            `;
        }
        
        if (person.details.lastDutyExtDate) {
            detailsHTML += `
                <div class="info-row">
                    <span class="info-label">Son Uzatma Tarihi:</span>
                    <span class="info-value">${person.details.lastDutyExtDate}</span>
                </div>
            `;
        }

        if (person.details.scores && person.details.scores.length > 0) {
            const latestScore = person.details.scores[0];
            detailsHTML += `
                <div class="info-row">
                    <span class="info-label">Son Atama/Terfİ:</span>
                    <span class="info-value">${latestScore.score_type} (${latestScore.score_date})</span>
                </div>
            `;
        }
        
        if (person.details.title) {
            detailsHTML += `
                <div class="info-row">
                    <span class="info-label">Unvan:</span>
                    <span class="info-value">${person.details.title}</span>
                </div>
            `;
        }

        const langTagsHTML = person.langScores.length > 0 
            ? person.langScores.map(ls => 
                `<span class="tag lang-${ls.score.toLowerCase()}">🌐 Yabancı Dil: ${ls.score} (${ls.date})</span>`
            ).join('')
            : '';

        return `
            <div class="personnel-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>${person.fullName}</h3>
                        <div class="registr-no">Sicil No: ${person.registrNo}</div>
                    </div>
                    <div>
                        <span class="card-badge ${badgeClass}">${person.position}</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">TC Kimlik No:</span>
                        <span class="info-value">${person.tcNo}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">İTÜ Mail:</span>
                        <span class="info-value">${person.ituMail}</span>
                    </div>
                    ${person.personalMail ? `
                    <div class="info-row">
                        <span class="info-label">Kişisel Mail:</span>
                        <span class="info-value">${person.personalMail}</span>
                    </div>
                    ` : ''}
                    <div class="info-row">
                        <span class="info-label">Bölüm:</span>
                        <span class="info-value">${person.department}</span>
                    </div>
                    ${person.registrationDate ? `
                    <div class="info-row">
                        <span class="info-label">Kayıt Tarihi:</span>
                        <span class="info-value">${person.registrationDate}</span>
                    </div>
                    ` : ''}
                    ${detailsHTML}
                </div>
                
                <div class="card-footer">
                    <span class="card-badge ${statusBadge}">${person.status}</span>
                    ${person.gender ? `<span class="tag">${person.gender}</span>` : ''}
                    ${langTagsHTML}
                </div>
            </div>
        `;
    }
}
