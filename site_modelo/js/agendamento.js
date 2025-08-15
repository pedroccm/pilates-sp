// ===== BOOKING SYSTEM JAVASCRIPT =====

class BookingSystem {
    constructor() {
        // Configuration
        this.studioPhone = '5519991289963'; // WhatsApp number
        
        // State management
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.formData = {};
        
        // Calendar state
        this.currentDate = new Date();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        // Available time slots configuration
        this.timeSlots = {
            morning: ['06:00', '06:50', '07:40', '08:30', '09:20', '10:10', '11:00'],
            afternoon: ['13:00', '13:50', '14:40', '15:30', '16:20', '17:10', '18:00'],
            evening: ['18:50', '19:40', '20:30']
        };
        
        // Services configuration
        this.services = {
            'pilates-individual': {
                name: 'Pilates Individual',
                price: 'R$ 150',
                duration: 50
            },
            'pilates-dupla': {
                name: 'Pilates em Dupla',
                price: 'R$ 100 cada',
                duration: 50
            },
            'pilates-aparelhos': {
                name: 'Pilates com Aparelhos',
                price: 'R$ 80',
                duration: 50
            },
            'pilates-solo': {
                name: 'Pilates Solo',
                price: 'R$ 60',
                duration: 50
            },
            'pilates-gestantes': {
                name: 'Pilates Gestantes',
                price: 'R$ 120',
                duration: 50
            },
            'avaliacao-gratuita': {
                name: 'Avaliação Gratuita',
                price: 'GRATUITO',
                duration: 30
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateCalendar();
        this.updateProgressSteps();
    }
    
    bindEvents() {
        // Service selection
        document.querySelectorAll('.service-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectService(e));
        });
        
        // Navigation buttons
        document.getElementById('next-step-1')?.addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-2')?.addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-3')?.addEventListener('click', () => this.nextStep());
        
        document.getElementById('back-step-2')?.addEventListener('click', () => this.prevStep());
        document.getElementById('back-step-3')?.addEventListener('click', () => this.prevStep());
        document.getElementById('back-step-4')?.addEventListener('click', () => this.prevStep());
        
        // Calendar navigation
        document.getElementById('prev-month')?.addEventListener('click', () => this.prevMonth());
        document.getElementById('next-month')?.addEventListener('click', () => this.nextMonth());
        
        // Form submission
        document.getElementById('confirm-booking')?.addEventListener('click', (e) => this.confirmBooking(e));
        
        // Modal events
        document.getElementById('go-to-whatsapp')?.addEventListener('click', () => this.goToWhatsApp());
        document.getElementById('close-modal')?.addEventListener('click', () => this.closeModal());
        
        // Form validation
        this.bindFormValidation();
    }
    
    bindFormValidation() {
        const inputs = document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateForm());
            input.addEventListener('blur', () => this.validateForm());
        });
    }
    
    // ===== STEP NAVIGATION =====
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateSteps();
            this.updateProgressSteps();
            
            if (this.currentStep === 3) {
                this.generateTimeSlots();
            } else if (this.currentStep === 4) {
                this.updateBookingSummary();
            }
        }
    }
    
    prevStep() {
        this.currentStep--;
        this.updateSteps();
        this.updateProgressSteps();
    }
    
    updateSteps() {
        // Hide all steps
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    updateProgressSteps() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedService) {
                    this.showNotification('Por favor, selecione uma modalidade.', 'warning');
                    return false;
                }
                return true;
            case 2:
                if (!this.selectedDate) {
                    this.showNotification('Por favor, selecione uma data.', 'warning');
                    return false;
                }
                return true;
            case 3:
                if (!this.selectedTime) {
                    this.showNotification('Por favor, selecione um horário.', 'warning');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }
    
    // ===== SERVICE SELECTION =====
    selectService(e) {
        const option = e.currentTarget;
        const serviceId = option.dataset.service;
        
        // Remove previous selection
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection
        option.classList.add('selected');
        this.selectedService = serviceId;
        
        // Enable next button
        const nextBtn = document.getElementById('next-step-1');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    // ===== CALENDAR FUNCTIONALITY =====
    generateCalendar() {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const currentMonthElement = document.getElementById('current-month');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }
        
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            const dateStr = this.formatDate(date);
            dayElement.dataset.date = dateStr;
            
            // Styling based on date status
            if (date.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            } else if (date < today) {
                dayElement.classList.add('past');
            } else if (this.isDateAvailable(date)) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', (e) => this.selectDate(e));
                
                if (this.selectedDate === dateStr) {
                    dayElement.classList.add('selected');
                }
            }
            
            if (this.isSameDay(date, today)) {
                dayElement.classList.add('today');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    isDateAvailable(date) {
        const dayOfWeek = date.getDay();
        // Available Monday to Saturday (1-6), closed on Sunday (0)
        return dayOfWeek >= 1 && dayOfWeek <= 6;
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    selectDate(e) {
        const dayElement = e.currentTarget;
        const dateStr = dayElement.dataset.date;
        
        // Remove previous selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection
        dayElement.classList.add('selected');
        this.selectedDate = dateStr;
        
        // Update display
        const selectedDateDisplay = document.getElementById('selected-date-display');
        if (selectedDateDisplay) {
            const date = new Date(dateStr + 'T00:00:00');
            selectedDateDisplay.textContent = this.formatDisplayDate(date);
        }
        
        // Enable next button
        const nextBtn = document.getElementById('next-step-2');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.generateCalendar();
    }
    
    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.generateCalendar();
    }
    
    // ===== TIME SLOTS =====
    generateTimeSlots() {
        if (!this.selectedDate) return;
        
        const selectedDate = new Date(this.selectedDate + 'T00:00:00');
        const dayOfWeek = selectedDate.getDay();
        
        // Generate slots for each period
        this.generatePeriodSlots('morning-slots', this.timeSlots.morning, dayOfWeek);
        this.generatePeriodSlots('afternoon-slots', this.timeSlots.afternoon, dayOfWeek);
        this.generatePeriodSlots('evening-slots', this.timeSlots.evening, dayOfWeek);
    }
    
    generatePeriodSlots(containerId, slots, dayOfWeek) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        slots.forEach(time => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = time;
            slotElement.dataset.time = time;
            
            // Check availability (simplified - in real app, check against bookings)
            if (this.isTimeAvailable(time, dayOfWeek)) {
                slotElement.classList.add('available');
                slotElement.addEventListener('click', (e) => this.selectTime(e));
            } else {
                slotElement.classList.add('unavailable');
            }
            
            container.appendChild(slotElement);
        });
    }
    
    isTimeAvailable(time, dayOfWeek) {
        // Simplified availability logic
        // Saturday: only morning and afternoon
        if (dayOfWeek === 6) {
            return !this.timeSlots.evening.includes(time);
        }
        
        // Sunday: closed
        if (dayOfWeek === 0) {
            return false;
        }
        
        // Weekdays: all times available
        return true;
    }
    
    selectTime(e) {
        const slotElement = e.currentTarget;
        const time = slotElement.dataset.time;
        
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection
        slotElement.classList.add('selected');
        this.selectedTime = time;
        
        // Enable next button
        const nextBtn = document.getElementById('next-step-3');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    // ===== BOOKING SUMMARY =====
    updateBookingSummary() {
        if (!this.selectedService || !this.selectedDate || !this.selectedTime) return;
        
        const service = this.services[this.selectedService];
        const date = new Date(this.selectedDate + 'T00:00:00');
        
        // Update summary elements
        document.getElementById('summary-service').textContent = service.name;
        document.getElementById('summary-date').textContent = this.formatDisplayDate(date);
        document.getElementById('summary-time').textContent = this.selectedTime;
        document.getElementById('summary-duration').textContent = service.duration;
        document.getElementById('summary-price').textContent = service.price;
    }
    
    // ===== FORM HANDLING =====
    validateForm() {
        const form = document.getElementById('booking-form');
        const confirmButton = document.getElementById('confirm-booking');
        
        if (!form || !confirmButton) return;
        
        const requiredInputs = form.querySelectorAll('input[required], select[required]');
        const termsCheckbox = document.getElementById('terms-agree');
        
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });
        
        if (!termsCheckbox?.checked) {
            isValid = false;
        }
        
        confirmButton.disabled = !isValid;
    }
    
    collectFormData() {
        const form = document.getElementById('booking-form');
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    confirmBooking(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) return;
        
        this.formData = this.collectFormData();
        
        // Show confirmation modal
        this.showConfirmationModal();
    }
    
    // ===== MODAL FUNCTIONALITY =====
    showConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        if (!modal) return;
        
        // Update modal content
        const service = this.services[this.selectedService];
        const date = new Date(this.selectedDate + 'T00:00:00');
        
        document.getElementById('modal-service').textContent = service.name;
        document.getElementById('modal-date').textContent = this.formatDisplayDate(date);
        document.getElementById('modal-time').textContent = this.selectedTime;
        document.getElementById('modal-name').textContent = this.formData.name || 'N/A';
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // ===== WHATSAPP INTEGRATION =====
    goToWhatsApp() {
        const service = this.services[this.selectedService];
        const date = new Date(this.selectedDate + 'T00:00:00');
        
        // Create WhatsApp message
        const message = this.createWhatsAppMessage(service, date);
        const whatsappURL = `https://wa.me/${this.studioPhone}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Close modal after a delay
        setTimeout(() => {
            this.closeModal();
            this.resetBooking();
        }, 1000);
    }
    
    createWhatsAppMessage(service, date) {
        const formattedDate = this.formatDisplayDate(date);
        
        let message = `🧘‍♀️ *AGENDAMENTO - STUDIO EQUILIBRIUM*\n\n`;
        message += `📅 *Modalidade:* ${service.name}\n`;
        message += `📅 *Data:* ${formattedDate}\n`;
        message += `⏰ *Horário:* ${this.selectedTime}\n`;
        message += `⏱️ *Duração:* ${service.duration} minutos\n`;
        message += `💰 *Valor:* ${service.price}\n\n`;
        
        message += `👤 *DADOS DO CLIENTE:*\n`;
        message += `Nome: ${this.formData.name}\n`;
        message += `E-mail: ${this.formData.email}\n`;
        message += `Telefone: ${this.formData.phone}\n`;
        
        if (this.formData.age) {
            message += `Idade: ${this.formData.age} anos\n`;
        }
        
        if (this.formData.experience) {
            message += `Experiência: ${this.getExperienceText(this.formData.experience)}\n`;
        }
        
        if (this.formData.objective) {
            message += `Objetivo: ${this.getObjectiveText(this.formData.objective)}\n`;
        }
        
        if (this.formData.observations) {
            message += `\n📝 *Observações:* ${this.formData.observations}\n`;
        }
        
        message += `\n✅ Gostaria de confirmar este agendamento!`;
        
        return message;
    }
    
    getExperienceText(value) {
        const options = {
            'nunca-pratiquei': 'Nunca pratiquei',
            'iniciante': 'Iniciante (menos de 6 meses)',
            'intermediario': 'Intermediário (6 meses a 2 anos)',
            'avancado': 'Avançado (mais de 2 anos)'
        };
        return options[value] || value;
    }
    
    getObjectiveText(value) {
        const options = {
            'condicionamento': 'Condicionamento físico',
            'reabilitacao': 'Reabilitação/Fisioterapia',
            'postura': 'Correção postural',
            'flexibilidade': 'Ganho de flexibilidade',
            'relaxamento': 'Relaxamento e bem-estar',
            'gestacao': 'Pilates na gestação',
            'outros': 'Outros'
        };
        return options[value] || value;
    }
    
    // ===== UTILITY METHODS =====
    formatDate(date) {
        return date.getFullYear() + '-' +
               String(date.getMonth() + 1).padStart(2, '0') + '-' +
               String(date.getDate()).padStart(2, '0');
    }
    
    formatDisplayDate(date) {
        const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const weekday = weekdays[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${weekday}, ${day} de ${month} de ${year}`;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        notification.style.background = colors[type] || colors.info;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    resetBooking() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.formData = {};
        
        // Reset UI
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
        }
        
        this.updateSteps();
        this.updateProgressSteps();
        this.generateCalendar();
        
        // Reset buttons
        document.getElementById('next-step-1').disabled = true;
        document.getElementById('next-step-2').disabled = true;
        document.getElementById('next-step-3').disabled = true;
    }
}

// ===== PHONE INPUT FORMATTING =====
class PhoneFormatter {
    constructor() {
        this.init();
    }
    
    init() {
        const phoneInput = document.getElementById('client-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhone(e));
            phoneInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
    }
    
    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                // Format as (xx) xxxx-xxxx
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, (match, p1, p2, p3) => {
                    if (p3) return `(${p1}) ${p2}-${p3}`;
                    if (p2) return `(${p1}) ${p2}`;
                    if (p1) return `(${p1}`;
                    return match;
                });
            } else {
                // Format as (xx) 9xxxx-xxxx
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, (match, p1, p2, p3) => {
                    if (p3) return `(${p1}) ${p2}-${p3}`;
                    if (p2) return `(${p1}) ${p2}`;
                    return match;
                });
            }
        }
        
        e.target.value = value;
    }
    
    handleKeydown(e) {
        // Allow backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey) ||
            (e.keyCode === 67 && e.ctrlKey) ||
            (e.keyCode === 86 && e.ctrlKey) ||
            (e.keyCode === 88 && e.ctrlKey) ||
            // Allow home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }
}

// ===== INITIALIZE BOOKING SYSTEM =====
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the booking page
    if (document.querySelector('.booking-section')) {
        const bookingSystem = new BookingSystem();
        const phoneFormatter = new PhoneFormatter();
        
        // Make booking system globally available for debugging
        window.BookingSystem = bookingSystem;
    }
});

// ===== ADDITIONAL UTILITIES =====

// Smooth scroll to booking section when coming from other pages
if (window.location.hash === '#booking') {
    document.addEventListener('DOMContentLoaded', () => {
        const bookingSection = document.querySelector('.booking-section');
        if (bookingSection) {
            setTimeout(() => {
                bookingSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    });
}

// Handle page visibility change (useful for real-time availability)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.BookingSystem) {
        // Refresh availability when user returns to page
        window.BookingSystem.generateCalendar();
        if (window.BookingSystem.selectedDate) {
            window.BookingSystem.generateTimeSlots();
        }
    }
});

// Service Worker message handling for booking updates
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'booking-update' && window.BookingSystem) {
            window.BookingSystem.generateTimeSlots();
            window.BookingSystem.showNotification('Horários atualizados!', 'info');
        }
    });
}