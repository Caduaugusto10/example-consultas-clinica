// Dados simulados de agendamentos
let appointments = [
    {
        id: 'CS001',
        specialty: 'Cardiologia',
        specialtyIcon: '❤️',
        doctor: 'Dr. João Silva',
        crm: 'CRM 12345',
        date: '2025-11-05',
        time: '14:30',
        status: 'upcoming',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'Unimed',
        notes: 'Consulta de rotina para check-up cardiovascular'
    },
    {
        id: 'CS002',
        specialty: 'Dermatologia',
        specialtyIcon: '🩺',
        doctor: 'Dra. Ana Costa',
        crm: 'CRM 34567',
        date: '2025-11-12',
        time: '10:00',
        status: 'upcoming',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'Particular',
        notes: 'Avaliação de manchas na pele'
    },
    {
        id: 'CS003',
        specialty: 'Ortopedia',
        specialtyIcon: '🦴',
        doctor: 'Dr. Carlos Mendes',
        crm: 'CRM 56789',
        date: '2025-10-28',
        time: '09:00',
        status: 'past',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'SulAmérica',
        notes: 'Dor no joelho direito'
    },
    {
        id: 'CS004',
        specialty: 'Clínica Geral',
        specialtyIcon: '👨‍⚕️',
        doctor: 'Dra. Lucia Martins',
        crm: 'CRM 22334',
        date: '2025-10-15',
        time: '15:30',
        status: 'past',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'Unimed',
        notes: 'Consulta de rotina'
    },
    {
        id: 'CS005',
        specialty: 'Pediatria',
        specialtyIcon: '👶',
        doctor: 'Dra. Beatriz Alves',
        crm: 'CRM 78901',
        date: '2025-10-20',
        time: '11:00',
        status: 'cancelled',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'Bradesco Saúde',
        notes: 'Consulta cancelada pelo paciente'
    },
    {
        id: 'CS006',
        specialty: 'Cardiologia',
        specialtyIcon: '❤️',
        doctor: 'Dr. João Silva',
        crm: 'CRM 12345',
        date: '2025-11-20',
        time: '16:00',
        status: 'upcoming',
        patient: 'Carlos Augusto',
        phone: '(11) 98765-4321',
        insurance: 'Unimed',
        notes: 'Retorno - Acompanhamento do tratamento'
    }
];

let currentFilter = 'all';
let appointmentToCancel = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    initializeFilters();
    initializeSearch();
    updateCounts();
});

// Carregar agendamentos
function loadAppointments(filter = 'all', searchTerm = '') {
    const appointmentsList = document.getElementById('appointments-list');
    const emptyState = document.getElementById('empty-state');
    
    let filteredAppointments = appointments;
    
    // Aplicar filtro de status
    if (filter !== 'all') {
        filteredAppointments = filteredAppointments.filter(app => app.status === filter);
    }
    
    // Aplicar busca
    if (searchTerm) {
        filteredAppointments = filteredAppointments.filter(app => 
            app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Ordenar: próximas primeiro, depois passadas, depois canceladas
    filteredAppointments.sort((a, b) => {
        const statusOrder = { upcoming: 1, past: 2, cancelled: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.date) - new Date(a.date);
    });
    
    if (filteredAppointments.length === 0) {
        appointmentsList.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        appointmentsList.innerHTML = filteredAppointments.map(app => createAppointmentCard(app)).join('');
    }
}

// Criar card de agendamento
function createAppointmentCard(appointment) {
    const formattedDate = formatDate(appointment.date);
    const statusText = getStatusText(appointment.status);
    const canCancel = appointment.status === 'upcoming' && isMoreThan24Hours(appointment.date);
    
    return `
        <div class="appointment-card ${appointment.status}">
            <div class="appointment-header">
                <div class="appointment-info">
                    <span class="appointment-specialty">
                        ${appointment.specialtyIcon} ${appointment.specialty}
                    </span>
                    <div class="appointment-doctor">${appointment.doctor}</div>
                    <div class="appointment-crm">${appointment.crm}</div>
                </div>
                <div class="appointment-status">
                    <span class="status-badge ${appointment.status}">${statusText}</span>
                    <span class="appointment-code">Código: ${appointment.id}</span>
                </div>
            </div>
            
            <div class="appointment-details-grid">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-content">
                        <h4>Data</h4>
                        <p>${formattedDate}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">⏰</div>
                    <div class="detail-content">
                        <h4>Horário</h4>
                        <p>${appointment.time}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">💳</div>
                    <div class="detail-content">
                        <h4>Convênio</h4>
                        <p>${appointment.insurance || 'Particular'}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">📍</div>
                    <div class="detail-content">
                        <h4>Local</h4>
                        <p>Consultório 203</p>
                    </div>
                </div>
            </div>
            
            <div class="appointment-actions">
                <button class="btn-action btn-details" onclick="showDetails('${appointment.id}')">
                    ℹ️ Ver Detalhes
                </button>
                ${appointment.status === 'upcoming' ? `
                    <button class="btn-action btn-reschedule" onclick="rescheduleAppointment('${appointment.id}')">
                        🔄 Reagendar
                    </button>
                    <button class="btn-action btn-cancel ${!canCancel ? 'disabled' : ''}" 
                            onclick="${canCancel ? `showCancelModal('${appointment.id}')` : 'void(0)'}"
                            ${!canCancel ? 'title="Cancelamento disponível apenas com 24h de antecedência"' : ''}>
                        ❌ Cancelar
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Inicializar filtros
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            loadAppointments(currentFilter, document.getElementById('search-input').value);
        });
    });
}

// Inicializar busca
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', function() {
        loadAppointments(currentFilter, this.value);
    });
}

// Atualizar contadores
function updateCounts() {
    const all = appointments.length;
    const upcoming = appointments.filter(app => app.status === 'upcoming').length;
    const past = appointments.filter(app => app.status === 'past').length;
    const cancelled = appointments.filter(app => app.status === 'cancelled').length;
    
    document.getElementById('count-all').textContent = all;
    document.getElementById('count-upcoming').textContent = upcoming;
    document.getElementById('count-past').textContent = past;
    document.getElementById('count-cancelled').textContent = cancelled;
}

// Mostrar modal de cancelamento
function showCancelModal(appointmentId) {
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (!appointment) return;
    
    if (!isMoreThan24Hours(appointment.date)) {
        alert('Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência.');
        return;
    }
    
    appointmentToCancel = appointmentId;
    
    const cancelDetails = document.getElementById('cancel-details');
    cancelDetails.innerHTML = `
        <p><strong>Especialidade:</strong> ${appointment.specialty}</p>
        <p><strong>Médico:</strong> ${appointment.doctor}</p>
        <p><strong>Data:</strong> ${formatDate(appointment.date)}</p>
        <p><strong>Horário:</strong> ${appointment.time}</p>
    `;
    
    document.getElementById('cancel-modal').classList.add('active');
}

// Fechar modal de cancelamento
function closeCancelModal() {
    document.getElementById('cancel-modal').classList.remove('active');
    appointmentToCancel = null;
}

// Confirmar cancelamento
function confirmCancellation() {
    if (!appointmentToCancel) return;
    
    const appointment = appointments.find(app => app.id === appointmentToCancel);
    
    if (appointment) {
        // Animar remoção
        const card = document.querySelector(`[onclick*="${appointmentToCancel}"]`)?.closest('.appointment-card');
        if (card) {
            card.classList.add('fade-out');
        }
        
        // Atualizar status
        setTimeout(() => {
            appointment.status = 'cancelled';
            
            closeCancelModal();
            loadAppointments(currentFilter, document.getElementById('search-input').value);
            updateCounts();
            
            // Mostrar modal de sucesso
            document.getElementById('success-modal').classList.add('active');
        }, 500);
    }
}

// Fechar modal de sucesso
function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
}

// Mostrar detalhes
function showDetails(appointmentId) {
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (!appointment) return;
    
    const detailsContainer = document.getElementById('appointment-details');
    detailsContainer.innerHTML = `
        <div class="detail-section">
            <h4>📋 Informações da Consulta</h4>
            <div class="detail-row">
                <span class="detail-label">Código:</span>
                <span class="detail-value">${appointment.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Especialidade:</span>
                <span class="detail-value">${appointment.specialtyIcon} ${appointment.specialty}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Médico(a):</span>
                <span class="detail-value">${appointment.doctor}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${appointment.crm}</span>
                <span class="detail-value"></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${getStatusText(appointment.status)}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📅 Data e Horário</h4>
            <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value">${formatDate(appointment.date)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Horário:</span>
                <span class="detail-value">${appointment.time}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Local:</span>
                <span class="detail-value">Consultório 203 - 2º Andar</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>👤 Dados do Paciente</h4>
            <div class="detail-row">
                <span class="detail-label">Nome:</span>
                <span class="detail-value">${appointment.patient}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Telefone:</span>
                <span class="detail-value">${appointment.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Convênio:</span>
                <span class="detail-value">${appointment.insurance || 'Particular'}</span>
            </div>
        </div>
        
        ${appointment.notes ? `
        <div class="detail-section">
            <h4>📝 Observações</h4>
            <p style="color: #555; line-height: 1.6;">${appointment.notes}</p>
        </div>
        ` : ''}
        
        <div class="detail-section">
            <h4>📍 Endereço da Clínica</h4>
            <p style="color: #555; line-height: 1.6;">
                Rua da Saúde, 123 - Centro<br>
                São Paulo, SP - CEP 01000-000<br>
                Telefone: (11) 3456-7890
            </p>
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
}

// Fechar modal de detalhes
function closeDetailsModal() {
    document.getElementById('details-modal').classList.remove('active');
}

// Reagendar consulta
function rescheduleAppointment(appointmentId) {
    // Redirecionar para página de agendamento com dados pré-preenchidos
    alert('Redirecionando para reagendamento...');
    window.location.href = 'marcar-consulta.html?reschedule=' + appointmentId;
}

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const weekday = weekdays[date.getDay()];
    
    return `${day}/${month}/${year} (${weekday})`;
}

function getStatusText(status) {
    const statusMap = {
        'upcoming': '🟢 Agendada',
        'past': '🔵 Realizada',
        'cancelled': '⚫ Cancelada'
    };
    return statusMap[status] || status;
}

function isMoreThan24Hours(dateString) {
    const appointmentDate = new Date(dateString + 'T00:00:00');
    const now = new Date();
    const diffInHours = (appointmentDate - now) / (1000 * 60 * 60);
    return diffInHours > 24;
}

// Fechar modais ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});
