// app.js - Main Application Entry Point

class PersonnelApp {
    constructor() {
        this.storage = new DataStorage();
        this.ui = new PersonnelUI(this.storage);
    }

    init() {
        this.setupEventListeners();
        this.ui.init();
        this.checkInitialData();
    }

    setupEventListeners() {
        // Upload data button
        const uploadBtn = document.getElementById('uploadDataBtn');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        await this.storage.importFromJSON(file);
                        this.showNotification('✅ Veri başarıyla yüklendi!', 'success');
                        this.ui.render();
                    } catch (error) {
                        this.showNotification('❌ Veri yüklenirken hata oluştu: ' + error.message, 'error');
                    }
                    fileInput.value = ''; // Reset input
                }
            });
        }

        // Load sample data button
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => {
                this.loadSampleData();
            });
        }
    }

    checkInitialData() {
        // Check if there's any data
        if (this.storage.data.persons.length === 0) {
            // Show empty state
            document.getElementById('cardsContainer').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
        }
    }

    async loadSampleData() {
        try {
            const response = await fetch('sample_data.json');
            if (!response.ok) {
                throw new Error('Sample data file not found');
            }
            const sampleData = await response.json();
            
            // Import the sample data
            this.storage.data = {
                ...this.storage.initializeData(),
                ...sampleData
            };
            this.storage.saveData();
            
            this.showNotification('✅ Örnek veri başarıyla yüklendi!', 'success');
            this.ui.render();
        } catch (error) {
            this.showNotification('❌ Örnek veri yüklenirken hata oluştu: ' + error.message, 'error');
            console.error(error);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PersonnelApp();
    app.init();
});
