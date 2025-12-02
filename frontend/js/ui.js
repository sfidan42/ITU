// ui.js - UI Components and Rendering

class UI {
    
    // Show alert notification
    static showAlert(message, type = 'info') {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 4000);
    }

    // Create person card
    static createPersonCard(personData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.tcNo = personData.tc_no;
        
        const genderBadge = personData.gender ? 
            `<span class="badge ${personData.gender === 'Erkek' || personData.gender === 'E' ? 'badge-male' : 'badge-female'}">
                ${personData.gender}
            </span>` : '';
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${personData.name} ${personData.mid_name || ''} ${personData.surname}</div>
                    <div class="card-subtitle">Sicil No: ${personData.registr_no} | TC: ${personData.tc_no}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit" onclick="app.editPerson('${personData.tc_no}')">✏️</button>
                    <button class="btn-icon btn-delete" onclick="app.deletePerson('${personData.tc_no}')">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                ${personData.personal_mail ? `
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${personData.personal_mail}</span>
                    </div>
                ` : ''}
                ${personData.gender ? `
                    <div class="info-row">
                        <span class="info-label">Cinsiyet:</span>
                        <span class="info-value">${genderBadge}</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    // Create academic staff card
    static createAcademicCard(academicData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.registrNo = academicData.registr_no;
        
        const person = academicData.person;
        const statusBadge = academicData.personel?.status === 'Aktif' ? 
            '<span class="badge badge-active">Aktif</span>' : 
            '<span class="badge badge-inactive">Pasif</span>';
        
        let cardHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${person?.name || ''} ${person?.surname || ''}</div>
                    <div class="card-subtitle">${academicData.duty_type.replace(/_/g, ' ')} | Sicil: ${academicData.registr_no}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit" onclick="app.editAcademic(${academicData.registr_no})">✏️</button>
                    <button class="btn-icon btn-delete" onclick="app.deleteAcademic(${academicData.registr_no})">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span class="info-label">Durum:</span>
                    <span class="info-value">${statusBadge}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">İTÜ Email:</span>
                    <span class="info-value">${academicData.personel?.itu_mail || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Bölüm:</span>
                    <span class="info-value">${academicData.personel?.department || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Kayıt Tarihi:</span>
                    <span class="info-value">${academicData.personel?.registration_date || 'N/A'}</span>
                </div>
        `;

        // --- Specific Info based on Duty Type ---
        if (academicData.duty_type === 'Araştırma_Görevlisi') {
            const appType = academicData.appointment_type || 'Belirtilmemiş';
            const eduLevel = academicData.education_level === 'master' ? 'Yüksek Lisans' : 
                             academicData.education_level === 'phd' ? 'Doktora' : 'Belirtilmemiş';
            
            cardHTML += `
                <div class="info-row" style="background-color: #f0f7ff;">
                    <span class="info-label">Atanma Maddesi:</span>
                    <span class="info-value">${appType}</span>
                </div>
                <div class="info-row" style="background-color: #f0f7ff;">
                    <span class="info-label">Eğitim Düzeyi:</span>
                    <span class="info-value">${eduLevel}</span>
                </div>
            `;

            // Calculate extension info if 50d
            if (appType === '50d' && academicData.personel?.registration_date) {
                const regDate = new Date(academicData.personel.registration_date);
                const today = new Date();
                const yearsServed = (today - regDate) / (1000 * 60 * 60 * 24 * 365.25);
                const extInfo = BusinessLogic.calculateResearchAssistantExtension('50d', academicData.education_level, yearsServed);
                
                cardHTML += `
                    <div class="info-row" style="background-color: #fff3cd;">
                        <span class="info-label">Görev Uzatımı:</span>
                        <span class="info-value">${extInfo.message}</span>
                    </div>
                `;
            }
        } else if (academicData.duty_type === 'Profesör') {
            if (academicData.personel?.registration_date) {
                const regDate = new Date(academicData.personel.registration_date);
                const today = new Date();
                const yearsServed = (today - regDate) / (1000 * 60 * 60 * 24 * 365.25);
                const scores = BusinessLogic.calculateProfessorScores(yearsServed);
                
                cardHTML += `
                    <div class="expandable-section">
                        <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                            <span>🎓 Profesörlük Hakları (${Math.floor(yearsServed)} Yıl)</span>
                            <span>▼</span>
                        </div>
                        <div class="expandable-content">
                            <div class="info-row"><span class="info-label">Makam Tazminatı:</span><span class="info-value">${scores.makam_tazminati}</span></div>
                            <div class="info-row"><span class="info-label">Üniversite Ödeneği:</span><span class="info-value">${scores.universite_odenegi}</span></div>
                            <div class="info-row"><span class="info-label">Ek Gösterge:</span><span class="info-value">${scores.ek_gosterge}</span></div>
                        </div>
                    </div>
                `;
            }
        }

        cardHTML += `</div>`; // Close card-body
        
        // High Academic Scores
        if (academicData.high_scores && academicData.high_scores.length > 0) {
            cardHTML += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                        <span>📊 Akademik Puanlar (${academicData.high_scores.length})</span>
                        <span>▼</span>
                    </div>
                    <div class="expandable-content">
                        <div class="json-display">
                            <pre>${JSON.stringify(academicData.high_scores, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Duty Extensions (for low academic)
        if (academicData.duty_extensions && academicData.duty_extensions.length > 0) {
            cardHTML += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                        <span>📅 Görev Uzatmaları (${academicData.duty_extensions.length})</span>
                        <span>▼</span>
                    </div>
                    <div class="expandable-content">
                        <div class="json-display">
                            <pre>${JSON.stringify(academicData.duty_extensions, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `;
        }

        // Language Scores
        if (academicData.language_scores && academicData.language_scores.length > 0) {
            const langItems = academicData.language_scores.map(score => {
                const validity = BusinessLogic.checkLanguageScoreValidity(score.date);
                const style = validity.valid ? 'color: green;' : 'color: red; text-decoration: line-through;';
                const icon = validity.valid ? '✅' : '⚠️';
                return `
                    <div class="info-row">
                        <span class="info-label">${score.language} (${score.date}):</span>
                        <span class="info-value" style="${style}">${score.score} ${icon} <small>${validity.message}</small></span>
                    </div>
                `;
            }).join('');

            cardHTML += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                        <span>🗣️ Dil Tazminatı (${academicData.language_scores.length})</span>
                        <span>▼</span>
                    </div>
                    <div class="expandable-content">
                        ${langItems}
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = cardHTML;
        return card;
    }

    // Create administrative staff card
    static createAdministrativeCard(adminData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.registrNo = adminData.registr_no;
        
        const person = adminData.person;
        const statusBadge = adminData.status === 'Aktif' ? 
            '<span class="badge badge-active">Aktif</span>' : 
            '<span class="badge badge-inactive">Pasif</span>';
        
        // Calculate next promotion date
        let nextPromotionInfo = '';
        if (adminData.registration_date) {
            const nextPromDate = BusinessLogic.calculateNextPromotion(adminData.registration_date);
            nextPromotionInfo = `
                <div class="info-row" style="background-color: #e8f5e9;">
                    <span class="info-label">Sonraki Terfi:</span>
                    <span class="info-value">${nextPromDate.toLocaleDateString('tr-TR')}</span>
                </div>
            `;
        }

        let cardHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${person?.name || ''} ${person?.surname || ''}</div>
                    <div class="card-subtitle">İdari Personel | Sicil: ${adminData.registr_no}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit" onclick="app.editAdministrative(${adminData.registr_no})">✏️</button>
                    <button class="btn-icon btn-delete" onclick="app.deleteAdministrative(${adminData.registr_no})">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span class="info-label">Durum:</span>
                    <span class="info-value">${statusBadge}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">İTÜ Email:</span>
                    <span class="info-value">${adminData.itu_mail || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Bölüm:</span>
                    <span class="info-value">${adminData.department || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Kayıt Tarihi:</span>
                    <span class="info-value">${adminData.registration_date || 'N/A'}</span>
                </div>
                ${nextPromotionInfo}
            </div>
        `;
        
        // Management staff info with promotions
        if (adminData.management_staff) {
            const mgmt = adminData.management_staff;
            cardHTML += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                        <span>👔 Yönetim Kadrosu - ${mgmt.title}</span>
                        <span>▼</span>
                    </div>
                    <div class="expandable-content">
                        ${mgmt.promotions && mgmt.promotions.length > 0 ? `
                            <div class="json-display">
                                <pre>${JSON.stringify(mgmt.promotions, null, 2)}</pre>
                            </div>
                        ` : '<p style="padding: 10px; color: #999;">Terfi kaydı bulunmamaktadır.</p>'}
                    </div>
                </div>
            `;
        }

        // Language Scores
        if (adminData.language_scores && adminData.language_scores.length > 0) {
            cardHTML += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                        <span>🗣️ Dil Tazminatı (${adminData.language_scores.length})</span>
                        <span>▼</span>
                    </div>
                    <div class="expandable-content">
                        <div class="json-display">
                            <pre>${JSON.stringify(adminData.language_scores, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = cardHTML;
        return card;
    }

    // Create system admin card
    static createSystemAdminCard(adminData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.registrNo = adminData.registr_no;
        
        const person = adminData.person;
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${person?.name || ''} ${person?.surname || ''}</div>
                    <div class="card-subtitle">Sistem Yöneticisi | Sicil: ${adminData.registr_no}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon btn-edit" onclick="app.editSystemAdmin(${adminData.registr_no})">✏️</button>
                    <button class="btn-icon btn-delete" onclick="app.deleteSystemAdmin(${adminData.registr_no})">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span class="info-label">Kullanıcı Adı:</span>
                    <span class="info-value">${adminData.user_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">İTÜ Email:</span>
                    <span class="info-value">${adminData.personel?.itu_mail || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Bölüm:</span>
                    <span class="info-value">${adminData.personel?.department || 'N/A'}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    // Render empty state
    static renderEmptyState(container, message = 'Kayıt bulunamadı') {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">${message}</div>
            </div>
        `;
    }

    // Create form field
    static createFormField(config) {
        const { name, label, type = 'text', required = false, options = null, value = '' } = config;
        
        let inputHTML = '';
        
        if (type === 'select' && options) {
            inputHTML = `
                <select id="${name}" name="${name}" ${required ? 'required' : ''}>
                    <option value="">Seçiniz...</option>
                    ${options.map(opt => `
                        <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                            ${opt.label}
                        </option>
                    `).join('')}
                </select>
            `;
        } else if (type === 'textarea') {
            inputHTML = `
                <textarea id="${name}" name="${name}" rows="3" ${required ? 'required' : ''}>${value}</textarea>
            `;
        } else {
            inputHTML = `
                <input type="${type}" id="${name}" name="${name}" value="${value}" ${required ? 'required' : ''}>
            `;
        }
        
        return `
            <div class="form-group">
                <label for="${name}">
                    ${label}
                    ${required ? '<span style="color: red;">*</span>' : ''}
                </label>
                ${inputHTML}
                <div class="error-message" id="${name}-error"></div>
            </div>
        `;
    }

    // Show modal
    static showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }

    // Hide modal
    static hideModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Display validation errors
    static displayErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Display new errors
        Object.keys(errors).forEach(fieldName => {
            const errorEl = document.getElementById(`${fieldName}-error`);
            const inputEl = document.getElementById(fieldName);
            
            if (errorEl) {
                errorEl.textContent = errors[fieldName];
            }
            if (inputEl) {
                inputEl.classList.add('error');
            }
        });
    }
}

// Export for use in other modules
window.UI = UI;
