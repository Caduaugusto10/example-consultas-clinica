// Estado da aplicação
let currentStep = 1;
let appointmentData = {
    specialty: '',
    specialtyName: '',
    doctor: '',
    doctorName: '',
    date: '',
    time: ''
};

// Dados dos médicos por especialidade
const doctors = {
    'cardiologia': [
        { id: 'dr1', name: 'Dr. João Silva', crm: 'CRM 12345', rating: 4.9, experience: '15 anos de experiência' },
        { id: 'dr2', name: 'Dra. Maria Santos', crm: 'CRM 23456', rating: 4.8, experience: '12 anos de experiência' }
    ],
    'dermatologia': [
        { id: 'dr3', name: 'Dra. Ana Costa', crm: 'CRM 34567', rating: 4.9, experience: '10 anos de experiência' },
        { id: 'dr4', name: 'Dr. Pedro Lima', crm: 'CRM 45678', rating: 4.7, experience: '8 anos de experiência' }
    ],
    'ortopedia': [
        { id: 'dr5', name: 'Dr. Carlos Mendes', crm: 'CRM 56789', rating: 4.8, experience: '18 anos de experiência' },
        { id: 'dr6', name: 'Dra. Julia Rocha', crm: 'CRM 67890', rating: 4.9, experience: '14 anos de experiência' }
    ],
    'pediatria': [
        { id: 'dr7', name: 'Dra. Beatriz Alves', crm: 'CRM 78901', rating: 5.0, experience: '20 anos de experiência' },
        { id: 'dr8', name: 'Dr. Rafael Souza', crm: 'CRM 89012', rating: 4.8, experience: '11 anos de experiência' }
    ],
    'ginecologia': [
        { id: 'dr9', name: 'Dra. Fernanda Dias', crm: 'CRM 90123', rating: 4.9, experience: '16 anos de experiência' },
        { id: 'dr10', name: 'Dra. Camila Nunes', crm: 'CRM 01234', rating: 4.8, experience: '9 anos de experiência' }
    ],
    'clinica-geral': [
        { id: 'dr11', name: 'Dr. Roberto Pires', crm: 'CRM 11223', rating: 4.7, experience: '13 anos de experiência' },
        { id: 'dr12', name: 'Dra. Lucia Martins', crm: 'CRM 22334', rating: 4.9, experience: '17 anos de experiência' }
    ]
};

// Horários disponíveis (simulação)
const availableTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
];

// Calendário
let currentDate = new Date();
let selectedDate = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeSpecialtySelection();
    initializeCalendar();
});

// Etapa 1: Seleção de Especialidade
function initializeSpecialtySelection() {
    const specialtyCards = document.querySelectorAll('.specialty-card');
    
    specialtyCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove seleção anterior
            specialtyCards.forEach(c => c.classList.remove('selected'));
            
            // Adiciona seleção atual
            this.classList.add('selected');
            
            // Salva dados
            appointmentData.specialty = this.dataset.specialty;
            appointmentData.specialtyName = this.querySelector('h4').textContent;
            
            // Aguarda um pouco e avança
            setTimeout(() => {
                loadDoctors(appointmentData.specialty);
                nextStep();
            }, 500);
        });
    });
}

// Carregar médicos
function loadDoctors(specialty) {
    const doctorList = document.getElementById('doctor-list');
    doctorList.innerHTML = '';
    
    const specialtyDoctors = doctors[specialty] || [];
    
    specialtyDoctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.dataset.doctorId = doctor.id;
        doctorCard.innerHTML = `
            <div class="doctor-avatar">👨‍⚕️</div>
            <div class="doctor-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.crm}</p>
                <p>${doctor.experience}</p>
                <p class="doctor-rating">⭐ ${doctor.rating}</p>
            </div>
        `;
        
        doctorCard.addEventListener('click', function() {
            document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            appointmentData.doctor = doctor.id;
            appointmentData.doctorName = doctor.name;
            
            setTimeout(() => {
                nextStep();
            }, 500);
        });
        
        doctorList.appendChild(doctorCard);
    });
}

// Inicializar Calendário
function initializeCalendar() {
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
}

// Renderizar Calendário
function renderCalendar() {
    const monthYear = document.getElementById('calendar-month-year');
    const calendarDays = document.getElementById('calendar-days');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    monthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1).getDay();
    // Último dia do mês
    const lastDate = new Date(year, month + 1, 0).getDate();
    // Último dia do mês anterior
    const prevLastDate = new Date(year, month, 0).getDate();
    
    calendarDays.innerHTML = '';
    
    // Dias do mês anterior
    for (let i = firstDay; i > 0; i--) {
        const day = createCalendarDay(prevLastDate - i + 1, 'other-month');
        calendarDays.appendChild(day);
    }
    
    // Dias do mês atual
    const today = new Date();
    for (let i = 1; i <= lastDate; i++) {
        const date = new Date(year, month, i);
        const isPast = date < today.setHours(0, 0, 0, 0);
        const isToday = date.toDateString() === new Date().toDateString();
        
        const day = createCalendarDay(i, isPast ? 'disabled' : '', isToday);
        
        if (!isPast) {
            day.addEventListener('click', function() {
                if (!this.classList.contains('disabled')) {
                    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    selectedDate = new Date(year, month, i);
                    appointmentData.date = formatDate(selectedDate);
                    
                    document.getElementById('selected-date-info').textContent = 
                        `Horários para ${formatDate(selectedDate)}`;
                    
                    loadTimeSlots();
                }
            });
        }
        
        calendarDays.appendChild(day);
    }
    
    // Dias do próximo mês
    const remainingDays = 42 - (firstDay + lastDate);
    for (let i = 1; i <= remainingDays; i++) {
        const day = createCalendarDay(i, 'other-month');
        calendarDays.appendChild(day);
    }
}

// Criar dia do calendário
function createCalendarDay(dayNumber, className = '', isToday = false) {
    const day = document.createElement('div');
    day.className = `calendar-day ${className} ${isToday ? 'today' : ''}`;
    day.textContent = dayNumber;
    return day;
}

// Carregar horários disponíveis
function loadTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';
    
    // Simular alguns horários indisponíveis aleatoriamente
    const unavailableSlots = [
        availableTimeSlots[Math.floor(Math.random() * availableTimeSlots.length)],
        availableTimeSlots[Math.floor(Math.random() * availableTimeSlots.length)]
    ];
    
    availableTimeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        if (unavailableSlots.includes(time)) {
            timeSlot.classList.add('unavailable');
        } else {
            timeSlot.addEventListener('click', function() {
                if (!this.classList.contains('unavailable')) {
                    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    appointmentData.time = time;
                    
                    setTimeout(() => {
                        nextStep();
                        fillConfirmation();
                    }, 500);
                }
            });
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

// Preencher dados de confirmação
function fillConfirmation() {
    document.getElementById('confirm-specialty').textContent = appointmentData.specialtyName;
    document.getElementById('confirm-doctor').textContent = appointmentData.doctorName;
    document.getElementById('confirm-date').textContent = appointmentData.date;
    document.getElementById('confirm-time').textContent = appointmentData.time;
}

// Formatar data
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Navegação entre etapas
function nextStep() {
    if (currentStep < 4) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        
        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousStep() {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Confirmar agendamento
function confirmAppointment() {
    const form = document.getElementById('patient-form');
    
    if (form.checkValidity()) {
        // Gerar código de consulta
        const appointmentCode = 'CS' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('appointment-code').textContent = appointmentCode;
        
        // Mostrar modal de sucesso
        document.getElementById('success-modal').classList.add('active');
        
        // Aqui você enviaria os dados para o servidor
        console.log('Dados do agendamento:', {
            ...appointmentData,
            patientName: document.getElementById('patient-name').value,
            patientCPF: document.getElementById('patient-cpf').value,
            patientPhone: document.getElementById('patient-phone').value,
            patientEmail: document.getElementById('patient-email').value,
            patientInsurance: document.getElementById('patient-insurance').value,
            patientNotes: document.getElementById('patient-notes').value,
            code: appointmentCode
        });
    } else {
        form.reportValidity();
    }
}

// Fechar modal
function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
    
    // Resetar formulário
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}
