// ==================== STATE MANAGEMENT ====================
const DB_KEY = 'lista100_';

function getState() {
    return {
        users: JSON.parse(localStorage.getItem(DB_KEY + 'users') || '[]'),
        currentUser: JSON.parse(localStorage.getItem(DB_KEY + 'currentUser') || 'null'),
        couples: JSON.parse(localStorage.getItem(DB_KEY + 'couples') || '[]'),
        goals: JSON.parse(localStorage.getItem(DB_KEY + 'goals') || '[]'),
        notifications: JSON.parse(localStorage.getItem(DB_KEY + 'notifications') || '[]'),
        settings: JSON.parse(localStorage.getItem(DB_KEY + 'settings') || '{}'),
        unlockedAchievements: JSON.parse(localStorage.getItem(DB_KEY + 'achievements') || '[]'),
        xp: parseInt(localStorage.getItem(DB_KEY + 'xp') || '0'),
        customCategories: JSON.parse(localStorage.getItem(DB_KEY + 'customCategories') || '[]'),
        addedSuggestions: JSON.parse(localStorage.getItem(DB_KEY + 'addedSuggestions') || '[]'),
        lastActivityDate: localStorage.getItem(DB_KEY + 'lastActivityDate') || '',
        streak: parseInt(localStorage.getItem(DB_KEY + 'streak') || '0'),
    };
}

function save(key, value) {
    localStorage.setItem(DB_KEY + key, JSON.stringify(value));
}

function saveSimple(key, value) {
    localStorage.setItem(DB_KEY + key, value.toString());
}

// ==================== UTILITY FUNCTIONS ====================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function generateInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

function getAllCategories() {
    const state = getState();
    return [...DEFAULT_CATEGORIES, ...state.customCategories];
}

function getCategoryById(id) {
    return getAllCategories().find(c => c.id === id) || { name: id, icon: '📌', color: '#6366f1' };
}

function getResponsibleLabel(val) {
    const labels = { ele: 'Ele', ela: 'Ela', nos: 'Nós' };
    return labels[val] || val;
}

// ==================== THEME ====================
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(DB_KEY + 'theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function loadTheme() {
    const theme = localStorage.getItem(DB_KEY + 'theme') || 'light';
    setTheme(theme);
}

// ==================== AUTH ====================
function showAuthForm(formId) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-password-confirm').value;

    if (!name) return showToast('Informe seu nome', 'error');
    if (!validateEmail(email)) return showToast('Email inválido', 'error');
    if (!validatePassword(password)) return showToast('Senha deve ter no mínimo 6 caracteres', 'error');
    if (password !== confirm) return showToast('As senhas não coincidem', 'error');

    const state = getState();
    if (state.users.find(u => u.email === email)) {
        return showToast('Este email já está cadastrado', 'error');
    }

    const user = {
        id: generateId(),
        name,
        email,
        password: btoa(password), // simple encoding for demo
        inviteCode: generateInviteCode(),
        coupleId: null,
        createdAt: new Date().toISOString()
    };

    state.users.push(user);
    save('users', state.users);
    save('currentUser', user);

    showToast('Conta criada com sucesso!', 'success');
    showOnboardingPage();
}

function handleLogin() {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!email || !password) return showToast('Preencha todos os campos', 'error');

    const state = getState();
    const user = state.users.find(u => u.email === email && atob(u.password) === password);

    if (!user) return showToast('Email ou senha incorretos', 'error');

    save('currentUser', user);
    showToast('Bem-vindo de volta!', 'success');

    if (!user.coupleId) {
        showOnboardingPage();
    } else {
        showAppPage();
    }
}

function handleGoogleLogin() {
    // Simulated Google Login
    const name = prompt('Simulação de Login com Google\nDigite seu nome:');
    if (!name) return;

    const email = name.toLowerCase().replace(/\s+/g, '.') + '@gmail.com';
    const state = getState();
    let user = state.users.find(u => u.email === email);

    if (!user) {
        user = {
            id: generateId(),
            name,
            email,
            password: btoa('google_' + Date.now()),
            inviteCode: generateInviteCode(),
            coupleId: null,
            createdAt: new Date().toISOString()
        };
        state.users.push(user);
        save('users', state.users);
    }

    save('currentUser', user);
    showToast(`Bem-vindo, ${name}!`, 'success');

    if (!user.coupleId) {
        showOnboardingPage();
    } else {
        showAppPage();
    }
}

function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    if (!validateEmail(email)) return showToast('Informe um email válido', 'error');

    const state = getState();
    const user = state.users.find(u => u.email === email);

    if (user) {
        // In a real app, send email. Here we'll just reset
        const newPass = Math.random().toString(36).substr(2, 8);
        user.password = btoa(newPass);
        save('users', state.users);
        showToast(`Sua nova senha é: ${newPass} (copie antes de fechar!)`, 'success');
    } else {
        // Don't reveal if user exists or not
        showToast('Se o email estiver cadastrado, você receberá as instruções', 'info');
    }
    showAuthForm('login-form');
}

function handleLogout() {
    save('currentUser', null);
    showPage('auth-page');
    showAuthForm('login-form');
}

// ==================== ONBOARDING ====================
function showOnboardingStep(stepId) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');

    if (stepId === 'create-couple') {
        const state = getState();
        const user = state.currentUser;
        document.getElementById('invite-code-text').textContent = user.inviteCode;
    }
}

function copyInviteCode() {
    const state = getState();
    const code = state.currentUser.inviteCode;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Código copiado!', 'success');
    }).catch(() => {
        showToast(`Código: ${code}`, 'info');
    });
}

function shareInviteCode() {
    const state = getState();
    const code = state.currentUser.inviteCode;
    const text = `Junte-se a mim na Lista dos 100! Use o código: ${code}`;

    if (navigator.share) {
        navigator.share({ title: 'Lista dos 100', text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Link copiado para compartilhar!', 'success');
        }).catch(() => {
            showToast(`Compartilhe: ${text}`, 'info');
        });
    }
}

function handleJoinCouple() {
    const code = document.getElementById('invite-code-input').value.trim().toUpperCase();
    if (!code || code.length !== 6) return showToast('Código inválido. Deve ter 6 caracteres.', 'error');

    const state = getState();
    const partner = state.users.find(u => u.inviteCode === code && u.id !== state.currentUser.id);

    if (!partner) return showToast('Código não encontrado. Verifique e tente novamente.', 'error');
    if (partner.coupleId) return showToast('Este usuário já está em um casal.', 'error');

    // Create couple
    const coupleId = generateId();

    // Update both users
    const currentIdx = state.users.findIndex(u => u.id === state.currentUser.id);
    const partnerIdx = state.users.findIndex(u => u.id === partner.id);

    state.users[currentIdx].coupleId = coupleId;
    state.users[partnerIdx].coupleId = coupleId;

    const couple = {
        id: coupleId,
        user1: partner.id,
        user2: state.currentUser.id,
        name: `${partner.name} & ${state.currentUser.name}`,
        createdAt: new Date().toISOString()
    };

    state.couples.push(couple);
    save('couples', state.couples);
    save('users', state.users);
    save('currentUser', state.users[currentIdx]);

    addNotification('💑 Casal conectado! Bem-vindos à Lista dos 100!');
    showToast('Vocês estão conectados! Vamos começar!', 'success');
    showAppPage();
}

function skipOnboarding() {
    showAppPage();
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showOnboardingPage() {
    showPage('onboarding-page');
    showOnboardingStep('onboarding-choice');
}

function showAppPage() {
    showPage('app-page');
    updateHeaderInfo();
    navigateTo('dashboard');
    populateCategorySelects();
    renderCustomCategories();
    loadSettingsValues();
    updateNotificationBell();
}

function navigateTo(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + section).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${section}"]`)?.classList.add('active');

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');

    // Render section content
    switch (section) {
        case 'dashboard': renderDashboard(); break;
        case 'goals': renderGoals(); break;
        case 'suggestions': renderSuggestions(); break;
        case 'achievements': renderAchievements(); break;
        case 'settings': loadSettingsValues(); break;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}

// ==================== HEADER ====================
function updateHeaderInfo() {
    const state = getState();
    const user = state.currentUser;
    if (!user) return;

    document.getElementById('header-avatar-text').textContent = user.name.charAt(0).toUpperCase();

    const levelInfo = getCurrentLevel(state.xp);
    document.getElementById('header-level-text').textContent = `Nível ${levelInfo.level}`;
}

// ==================== GOALS CRUD ====================
let currentGoalView = 'list';
let calendarDate = new Date();

function openGoalModal(goalId) {
    const modal = document.getElementById('goal-modal');
    modal.classList.add('active');

    // Populate categories
    const catSelect = document.getElementById('goal-category');
    catSelect.innerHTML = getAllCategories().map(c =>
        `<option value="${c.id}">${c.icon} ${c.name}</option>`
    ).join('');

    if (goalId) {
        const state = getState();
        const goal = state.goals.find(g => g.id === goalId);
        if (goal) {
            document.getElementById('goal-modal-title').textContent = 'Editar Meta';
            document.getElementById('goal-edit-id').value = goal.id;
            document.getElementById('goal-title').value = goal.title;
            document.getElementById('goal-description').value = goal.description || '';
            document.getElementById('goal-category').value = goal.category;
            document.getElementById('goal-responsible').value = goal.responsible;
            document.getElementById('goal-quantity').value = goal.quantity;
            document.getElementById('goal-target-date').value = goal.targetDate || '';
            return;
        }
    }

    // New goal defaults
    document.getElementById('goal-modal-title').textContent = 'Nova Meta';
    document.getElementById('goal-edit-id').value = '';
    document.getElementById('goal-title').value = '';
    document.getElementById('goal-description').value = '';
    document.getElementById('goal-category').value = DEFAULT_CATEGORIES[0].id;
    document.getElementById('goal-responsible').value = 'nos';
    document.getElementById('goal-quantity').value = 1;
    document.getElementById('goal-target-date').value = '';
}

function closeGoalModal() {
    document.getElementById('goal-modal').classList.remove('active');
}

function saveGoal() {
    const title = document.getElementById('goal-title').value.trim();
    if (!title) return showToast('O título é obrigatório', 'error');

    const state = getState();
    const editId = document.getElementById('goal-edit-id').value;

    const goalData = {
        title,
        description: document.getElementById('goal-description').value.trim(),
        category: document.getElementById('goal-category').value,
        responsible: document.getElementById('goal-responsible').value,
        quantity: Math.max(1, parseInt(document.getElementById('goal-quantity').value) || 1),
        targetDate: document.getElementById('goal-target-date').value || null,
    };

    if (editId) {
        const idx = state.goals.findIndex(g => g.id === editId);
        if (idx !== -1) {
            state.goals[idx] = { ...state.goals[idx], ...goalData };
            save('goals', state.goals);
            showToast('Meta atualizada!', 'success');
        }
    } else {
        // Check limit
        if (state.goals.length >= 100) {
            return showToast('Vocês já têm 100 metas! Concluam algumas antes de adicionar mais.', 'error');
        }

        const newGoal = {
            id: generateId(),
            ...goalData,
            progress: 0,
            status: 'todo',
            createdAt: new Date().toISOString(),
        };

        state.goals.push(newGoal);
        save('goals', state.goals);
        addXP(10, 'Meta criada!');
        showToast('Meta criada!', 'success');
    }

    closeGoalModal();
    renderGoals();
    checkAchievements();
    trackActivity();
}

function deleteGoal(goalId) {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;
    const state = getState();
    const goals = state.goals.filter(g => g.id !== goalId);
    save('goals', goals);
    showToast('Meta excluída', 'info');
    renderGoals();
    closeDetailModal();
}

function updateGoalProgress(goalId, delta) {
    const state = getState();
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const oldProgress = goal.progress;
    goal.progress = Math.max(0, Math.min(goal.quantity, goal.progress + delta));

    if (goal.progress !== oldProgress) {
        // Update status
        if (goal.progress >= goal.quantity) {
            if (goal.status !== 'done') {
                goal.status = 'done';
                addXP(50, `Meta concluída: ${goal.title}`);
                addNotification(`🎯 Meta concluída: "${goal.title}"! Parabéns!`);
            }
        } else if (goal.progress > 0) {
            goal.status = 'doing';
            if (delta > 0) addXP(5, 'Progresso!');
        } else {
            goal.status = 'todo';
        }

        save('goals', state.goals);
        renderGoals();
        checkAchievements();
        trackActivity();

        // Update detail modal if open
        const detailModal = document.getElementById('goal-detail-modal');
        if (detailModal.classList.contains('active')) {
            openDetailModal(goalId);
        }
    }
}

function updateGoalStatus(goalId, newStatus) {
    const state = getState();
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    goal.status = newStatus;
    if (newStatus === 'done') {
        goal.progress = goal.quantity;
        addXP(50, `Meta concluída: ${goal.title}`);
        addNotification(`🎯 Meta concluída: "${goal.title}"!`);
    } else if (newStatus === 'doing' && goal.progress === 0) {
        goal.progress = 0;
    } else if (newStatus === 'todo') {
        goal.progress = 0;
    }

    save('goals', state.goals);
    renderGoals();
    checkAchievements();
}

// ==================== GOAL VIEWS ====================
function setGoalView(view) {
    currentGoalView = view;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    document.querySelectorAll('.goal-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    renderGoals();
}

function getFilteredGoals() {
    const state = getState();
    let goals = [...state.goals];

    const search = document.getElementById('goal-search')?.value.toLowerCase() || '';
    const category = document.getElementById('filter-category')?.value || '';
    const responsible = document.getElementById('filter-responsible')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';

    if (search) goals = goals.filter(g => g.title.toLowerCase().includes(search));
    if (category) goals = goals.filter(g => g.category === category);
    if (responsible) goals = goals.filter(g => g.responsible === responsible);
    if (status) goals = goals.filter(g => g.status === status);

    return goals;
}

function filterGoals() {
    renderGoals();
}

function renderGoals() {
    const goals = getFilteredGoals();
    const state = getState();

    // Update count
    document.getElementById('goal-count').textContent = `${goals.length} meta${goals.length !== 1 ? 's' : ''}`;

    // Show/hide empty state
    const empty = document.getElementById('goals-empty');
    const hasGoals = state.goals.length > 0;
    empty.style.display = hasGoals ? 'none' : '';

    document.querySelectorAll('.goal-view').forEach(v => {
        if (v.classList.contains('active') && hasGoals) v.style.display = '';
        else if (!hasGoals && v.classList.contains('active')) v.style.display = 'none';
    });

    if (!hasGoals) {
        empty.style.display = '';
        return;
    }

    // Render based on current view
    switch (currentGoalView) {
        case 'list': renderListView(goals); break;
        case 'grid': renderGridView(goals); break;
        case 'kanban': renderKanbanView(goals); break;
        case 'calendar': renderCalendarView(goals); break;
    }
}

function renderListView(goals) {
    const body = document.getElementById('goal-list-body');
    if (goals.length === 0) {
        body.innerHTML = '<p class="empty-state-small">Nenhuma meta encontrada</p>';
        return;
    }

    body.innerHTML = goals.map(goal => {
        const cat = getCategoryById(goal.category);
        const pct = goal.quantity > 0 ? Math.round((goal.progress / goal.quantity) * 100) : 0;
        const statusColor = goal.status === 'done' ? 'var(--success)' : 'var(--primary)';

        return `
        <div class="goal-list-item" onclick="openDetailModal('${goal.id}')">
            <div class="gl-title-cell">
                <span>${cat.icon}</span>
                <span class="goal-title-text ${goal.status === 'done' ? 'done' : ''}">${escapeHtml(goal.title)}</span>
            </div>
            <div>
                <span class="gl-category-badge" style="background:${cat.color}15;color:${cat.color}">${cat.name}</span>
            </div>
            <div class="gl-responsible-badge">${getResponsibleLabel(goal.responsible)}</div>
            <div class="gl-progress-cell">
                <div class="progress-mini-bar">
                    <div class="progress-mini-fill" style="width:${pct}%;background:${statusColor}"></div>
                </div>
                <span class="progress-mini-text">${goal.progress}/${goal.quantity}</span>
            </div>
            <div class="gl-actions-cell" onclick="event.stopPropagation()">
                <button class="btn btn-icon-only" onclick="updateGoalProgress('${goal.id}', 1)" title="Incrementar">➕</button>
                <button class="btn btn-icon-only" onclick="updateGoalProgress('${goal.id}', -1)" title="Decrementar">➖</button>
            </div>
        </div>`;
    }).join('');
}

function renderGridView(goals) {
    const body = document.getElementById('goal-grid-body');
    if (goals.length === 0) {
        body.innerHTML = '<p class="empty-state-small">Nenhuma meta encontrada</p>';
        return;
    }

    body.innerHTML = goals.map(goal => {
        const cat = getCategoryById(goal.category);
        const pct = goal.quantity > 0 ? Math.round((goal.progress / goal.quantity) * 100) : 0;
        const statusColor = goal.status === 'done' ? 'var(--success)' : 'var(--primary)';

        return `
        <div class="goal-card" onclick="openDetailModal('${goal.id}')">
            <div class="goal-card-stripe" style="background:${cat.color}"></div>
            <div class="goal-card-header">
                <span class="goal-card-title ${goal.status === 'done' ? 'done' : ''}">${escapeHtml(goal.title)}</span>
                <span class="goal-card-category" style="background:${cat.color}15;color:${cat.color}">${cat.icon} ${cat.name}</span>
            </div>
            ${goal.description ? `<p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">${escapeHtml(goal.description).substring(0, 80)}</p>` : ''}
            <div class="goal-card-meta">
                <span>${getResponsibleLabel(goal.responsible)}</span>
                ${goal.targetDate ? `<span>📅 ${formatDate(goal.targetDate)}</span>` : ''}
            </div>
            <div class="goal-card-progress">
                <div class="goal-card-progress-bar">
                    <div class="goal-card-progress-fill" style="width:${pct}%;background:${statusColor}"></div>
                </div>
                <div class="goal-card-progress-text">
                    <span>${goal.progress} de ${goal.quantity}</span>
                    <span>${pct}%</span>
                </div>
            </div>
            <div class="goal-card-actions" onclick="event.stopPropagation()">
                <button class="btn btn-sm btn-outline" onclick="updateGoalProgress('${goal.id}', -1)">−</button>
                <button class="btn btn-sm btn-primary" onclick="updateGoalProgress('${goal.id}', 1)">+</button>
            </div>
        </div>`;
    }).join('');
}

function renderKanbanView(goals) {
    const todoGoals = goals.filter(g => g.status === 'todo');
    const doingGoals = goals.filter(g => g.status === 'doing');
    const doneGoals = goals.filter(g => g.status === 'done');

    document.getElementById('kanban-todo-count').textContent = todoGoals.length;
    document.getElementById('kanban-doing-count').textContent = doingGoals.length;
    document.getElementById('kanban-done-count').textContent = doneGoals.length;

    const renderCards = (goalList) => goalList.map(goal => {
        const cat = getCategoryById(goal.category);
        return `
        <div class="kanban-card" draggable="true" data-goal-id="${goal.id}"
             ondragstart="handleKanbanDragStart(event)" onclick="openDetailModal('${goal.id}')">
            <div class="kanban-card-title">${escapeHtml(goal.title)}</div>
            <div class="kanban-card-meta">
                <span class="kanban-card-category" style="background:${cat.color}15;color:${cat.color}">${cat.icon} ${cat.name}</span>
                <span>${goal.progress}/${goal.quantity}</span>
            </div>
        </div>`;
    }).join('');

    document.getElementById('kanban-todo').innerHTML = renderCards(todoGoals) || '<p class="empty-state-small">Vazio</p>';
    document.getElementById('kanban-doing').innerHTML = renderCards(doingGoals) || '<p class="empty-state-small">Vazio</p>';
    document.getElementById('kanban-done').innerHTML = renderCards(doneGoals) || '<p class="empty-state-small">Vazio</p>';
}

// Kanban Drag & Drop
function handleKanbanDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.goalId);
    e.target.classList.add('dragging');
}

function handleKanbanDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleKanbanDrop(e, newStatus) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const goalId = e.dataTransfer.getData('text/plain');
    if (goalId) {
        updateGoalStatus(goalId, newStatus);
    }
}

// Remove drag-over when leaving
document.addEventListener('dragleave', (e) => {
    if (e.target.classList) e.target.classList.remove('drag-over');
});

document.addEventListener('dragend', () => {
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
});

// ==================== CALENDAR VIEW ====================
function renderCalendarView() {
    const state = getState();
    const goals = state.goals.filter(g => g.targetDate);

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    document.getElementById('calendar-month-label').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0=Sunday
    const totalDays = lastDay.getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

    // Previous month days
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month"><div class="calendar-day-number">${prevLastDay - i}</div></div>`;
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const dayGoals = goals.filter(g => g.targetDate === dateStr);

        html += `<div class="calendar-day ${isToday ? 'today' : ''}">
            <div class="calendar-day-number">${day}</div>
            ${dayGoals.map(g => {
            const cat = getCategoryById(g.category);
            return `<div class="calendar-goal" style="background:${cat.color}" onclick="openDetailModal('${g.id}')" title="${escapeHtml(g.title)}">${escapeHtml(g.title)}</div>`;
        }).join('')}
        </div>`;
    }

    // Next month days
    const totalCells = startDay + totalDays;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
        html += `<div class="calendar-day other-month"><div class="calendar-day-number">${i}</div></div>`;
    }

    document.getElementById('calendar-grid').innerHTML = html;
}

function changeCalendarMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    renderCalendarView();
}

// ==================== DETAIL MODAL ====================
let currentDetailGoalId = null;

function openDetailModal(goalId) {
    currentDetailGoalId = goalId;
    const state = getState();
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const cat = getCategoryById(goal.category);
    const pct = goal.quantity > 0 ? Math.round((goal.progress / goal.quantity) * 100) : 0;
    const statusColor = goal.status === 'done' ? 'var(--success)' : 'var(--primary)';
    const statusLabels = { todo: 'A Fazer', doing: 'Em Andamento', done: 'Concluída' };

    document.getElementById('detail-title').textContent = goal.title;
    document.getElementById('detail-body').innerHTML = `
        ${goal.description ? `<div class="detail-section"><div class="detail-label">Descrição</div><div class="detail-value">${escapeHtml(goal.description)}</div></div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="detail-section">
                <div class="detail-label">Categoria</div>
                <div class="detail-value"><span class="gl-category-badge" style="background:${cat.color}15;color:${cat.color}">${cat.icon} ${cat.name}</span></div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Responsável</div>
                <div class="detail-value">${getResponsibleLabel(goal.responsible)}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Status</div>
                <div class="detail-value">${statusLabels[goal.status] || goal.status}</div>
            </div>
            ${goal.targetDate ? `<div class="detail-section"><div class="detail-label">Data-Alvo</div><div class="detail-value">📅 ${formatDate(goal.targetDate)}</div></div>` : ''}
        </div>
        <hr>
        <div class="detail-label" style="margin-bottom:12px">Progresso</div>
        <div class="detail-progress-section">
            <div class="detail-progress-controls">
                <button class="btn btn-outline" onclick="updateGoalProgress('${goal.id}', -1)">−</button>
                <span class="detail-progress-number">${goal.progress} / ${goal.quantity}</span>
                <button class="btn btn-primary" onclick="updateGoalProgress('${goal.id}', 1)">+</button>
            </div>
        </div>
        <div class="goal-card-progress-bar" style="height:12px;border-radius:6px">
            <div class="goal-card-progress-fill" style="width:${pct}%;background:${statusColor};height:100%;border-radius:6px"></div>
        </div>
        <div style="text-align:center;font-size:14px;color:var(--text-secondary);margin-top:8px">${pct}% concluído</div>
    `;

    document.getElementById('goal-detail-modal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('goal-detail-modal').classList.remove('active');
    currentDetailGoalId = null;
}

function editGoalFromDetail() {
    closeDetailModal();
    if (currentDetailGoalId) openGoalModal(currentDetailGoalId);
}

function deleteGoalFromDetail() {
    if (currentDetailGoalId) deleteGoal(currentDetailGoalId);
}

// ==================== SUGGESTIONS ====================
function renderSuggestions() {
    const state = getState();
    const filter = document.getElementById('suggestion-category-filter').value;

    let suggestions = [...SUGGESTIONS];
    if (filter) suggestions = suggestions.filter(s => s.category === filter);

    const grid = document.getElementById('suggestion-grid');
    grid.innerHTML = suggestions.map((s, i) => {
        const cat = getCategoryById(s.category);
        const isAdded = state.addedSuggestions.includes(s.title);

        return `
        <div class="suggestion-card ${isAdded ? 'added' : ''}">
            <div class="suggestion-info">
                <div class="suggestion-title">${cat.icon} ${escapeHtml(s.title)}</div>
                <div class="suggestion-category">${cat.name}${s.quantity ? ` • Quantidade: ${s.quantity}` : ''}</div>
            </div>
            <button class="suggestion-add-btn" onclick="addSuggestion(${i})" ${isAdded ? 'disabled' : ''}>
                ${isAdded ? '✓' : '+'}
            </button>
        </div>`;
    }).join('');
}

function filterSuggestions() {
    renderSuggestions();
}

function addSuggestion(index) {
    const suggestion = SUGGESTIONS[index];
    if (!suggestion) return;

    const state = getState();
    if (state.goals.length >= 100) {
        return showToast('Vocês já têm 100 metas!', 'error');
    }

    if (state.addedSuggestions.includes(suggestion.title)) {
        return showToast('Esta sugestão já foi adicionada', 'info');
    }

    const newGoal = {
        id: generateId(),
        title: suggestion.title,
        description: '',
        category: suggestion.category,
        responsible: 'nos',
        quantity: suggestion.quantity || 1,
        progress: 0,
        status: 'todo',
        targetDate: null,
        createdAt: new Date().toISOString(),
    };

    state.goals.push(newGoal);
    state.addedSuggestions.push(suggestion.title);
    save('goals', state.goals);
    save('addedSuggestions', state.addedSuggestions);

    addXP(10, 'Meta criada!');
    showToast(`"${suggestion.title}" adicionada!`, 'success');
    renderSuggestions();
    checkAchievements();
    trackActivity();
}

function surpriseMe() {
    const state = getState();
    const available = SUGGESTIONS.filter(s => !state.addedSuggestions.includes(s.title));

    if (available.length === 0) {
        showToast('Todas as sugestões já foram adicionadas!', 'info');
        return;
    }

    const suggestion = available[Math.floor(Math.random() * available.length)];
    const cat = getCategoryById(suggestion.category);
    const index = SUGGESTIONS.indexOf(suggestion);

    // Create surprise overlay
    const overlay = document.createElement('div');
    overlay.className = 'surprise-overlay';
    overlay.innerHTML = `
        <div class="surprise-card">
            <div class="surprise-icon">${cat.icon}</div>
            <div class="surprise-title">${escapeHtml(suggestion.title)}</div>
            <div class="surprise-category">${cat.name}</div>
            <div class="surprise-actions">
                <button class="btn btn-outline" onclick="this.closest('.surprise-overlay').remove()">Outra vez 🎲</button>
                <button class="btn btn-primary" onclick="addSuggestion(${index});this.closest('.surprise-overlay').remove()">Adicionar! ✨</button>
            </div>
        </div>
    `;

    // Remove previous surprise if exists
    document.querySelector('.surprise-overlay')?.remove();
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// ==================== GAMIFICATION ====================
function getCurrentLevel(xp) {
    let current = LEVELS[0];
    for (const level of LEVELS) {
        if (xp >= level.xpRequired) current = level;
        else break;
    }
    return current;
}

function getNextLevel(xp) {
    for (const level of LEVELS) {
        if (xp < level.xpRequired) return level;
    }
    return null; // Max level
}

function addXP(amount, reason) {
    const state = getState();
    const oldLevel = getCurrentLevel(state.xp);
    const newXP = state.xp + amount;
    saveSimple('xp', newXP);

    const newLevel = getCurrentLevel(newXP);

    if (newLevel.level > oldLevel.level) {
        // Level up!
        showCelebration(newLevel);
        addNotification(`⭐ Vocês subiram para o Nível ${newLevel.level}: ${newLevel.title}!`);
    }

    updateHeaderInfo();
}

function showCelebration(levelInfo) {
    document.getElementById('celebration-title').textContent = `Nível ${levelInfo.level}!`;
    document.getElementById('celebration-message').textContent = `Vocês agora são "${levelInfo.title}"! Continuem assim!`;
    document.getElementById('celebration-overlay').classList.add('active');
}

function closeCelebration() {
    document.getElementById('celebration-overlay').classList.remove('active');
}

function getAchievementStats() {
    const state = getState();
    const goals = state.goals;

    const categoryDone = {};
    DEFAULT_CATEGORIES.forEach(c => { categoryDone[c.id] = 0; });
    const categoriesUsed = new Set();

    goals.forEach(g => {
        if (g.status === 'done') {
            categoryDone[g.category] = (categoryDone[g.category] || 0) + 1;
        }
        categoriesUsed.add(g.category);
    });

    return {
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.status === 'done').length,
        level: getCurrentLevel(state.xp).level,
        categoryDone,
        categoriesUsed: categoriesUsed.size,
        streak: state.streak,
    };
}

function checkAchievements() {
    const state = getState();
    const stats = getAchievementStats();
    let newUnlocked = false;

    ACHIEVEMENTS.forEach(achievement => {
        if (!state.unlockedAchievements.includes(achievement.id)) {
            if (achievement.condition(stats)) {
                state.unlockedAchievements.push(achievement.id);
                newUnlocked = true;
                addNotification(`🏆 Nova conquista: "${achievement.name}"!`);
                showToast(`🏆 Conquista desbloqueada: ${achievement.name}!`, 'success');
            }
        }
    });

    if (newUnlocked) {
        save('achievements', state.unlockedAchievements);
    }
}

function renderAchievements() {
    const state = getState();
    const grid = document.getElementById('achievements-grid');

    grid.innerHTML = ACHIEVEMENTS.map(a => {
        const unlocked = state.unlockedAchievements.includes(a.id);
        return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${a.desc}</div>
            ${unlocked ? '<div class="achievement-unlocked-date">✅ Desbloqueada!</div>' : ''}
        </div>`;
    }).join('');
}

// ==================== ACTIVITY TRACKING ====================
function trackActivity() {
    const today = new Date().toISOString().split('T')[0];
    const state = getState();

    if (state.lastActivityDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActivityDate === yesterdayStr) {
            const newStreak = state.streak + 1;
            saveSimple('streak', newStreak);
        } else if (state.lastActivityDate !== today) {
            saveSimple('streak', 1);
        }

        saveSimple('lastActivityDate', today);
    }
}

// ==================== DASHBOARD ====================
function renderDashboard() {
    const state = getState();
    const goals = state.goals;
    const completedCount = goals.filter(g => g.status === 'done').length;

    // Greeting
    const couple = state.couples.find(c =>
        c.user1 === state.currentUser?.id || c.user2 === state.currentUser?.id
    );
    const settings = state.settings;
    const coupleName = settings.coupleName || (couple ? couple.name : state.currentUser?.name || 'Casal');
    document.getElementById('couple-greeting').textContent = `Olá, ${coupleName}!`;

    // Progress circle
    document.getElementById('progress-completed').textContent = completedCount;
    const pct = goals.length > 0 ? completedCount / 100 : 0;
    const circumference = 339.292;
    document.getElementById('progress-circle-fill').style.strokeDashoffset = circumference * (1 - pct);
    document.getElementById('progress-subtitle').textContent = `${completedCount} de 100 metas concluídas`;

    // XP & Level
    const xp = state.xp;
    const level = getCurrentLevel(xp);
    const nextLevel = getNextLevel(xp);

    document.getElementById('dash-level-badge').textContent = `⭐ Nível ${level.level}`;
    document.getElementById('dash-level-title').textContent = level.title;
    document.getElementById('xp-total-value').textContent = `${xp} XP`;

    if (nextLevel) {
        const levelProgress = ((xp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100;
        document.getElementById('xp-fill').style.width = `${Math.min(100, levelProgress)}%`;
        document.getElementById('xp-current').textContent = `${xp} XP`;
        document.getElementById('xp-next').textContent = `${nextLevel.xpRequired} XP`;
    } else {
        document.getElementById('xp-fill').style.width = '100%';
        document.getElementById('xp-current').textContent = `${xp} XP`;
        document.getElementById('xp-next').textContent = 'MAX';
    }

    // Upcoming goals
    const upcoming = goals
        .filter(g => g.targetDate && g.status !== 'done')
        .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
        .slice(0, 5);

    const upcomingEl = document.getElementById('upcoming-goals');
    if (upcoming.length > 0) {
        upcomingEl.innerHTML = upcoming.map(g => {
            const cat = getCategoryById(g.category);
            return `<div class="mini-goal-item" onclick="navigateTo('goals');openDetailModal('${g.id}')">
                <span class="mini-goal-icon">${cat.icon}</span>
                <div class="mini-goal-info">
                    <div class="mini-goal-name">${escapeHtml(g.title)}</div>
                    <div class="mini-goal-date">📅 ${formatDate(g.targetDate)}</div>
                </div>
            </div>`;
        }).join('');
    } else {
        upcomingEl.innerHTML = '<p class="empty-state-small">Nenhuma meta com data-alvo</p>';
    }

    // In progress goals
    const inProgress = goals.filter(g => g.status === 'doing').slice(0, 5);
    const inProgressEl = document.getElementById('in-progress-goals');
    if (inProgress.length > 0) {
        inProgressEl.innerHTML = inProgress.map(g => {
            const cat = getCategoryById(g.category);
            return `<div class="mini-goal-item" onclick="navigateTo('goals');openDetailModal('${g.id}')">
                <span class="mini-goal-icon">${cat.icon}</span>
                <div class="mini-goal-info">
                    <div class="mini-goal-name">${escapeHtml(g.title)}</div>
                    <div class="mini-goal-date">${g.progress}/${g.quantity}</div>
                </div>
            </div>`;
        }).join('');
    } else {
        inProgressEl.innerHTML = '<p class="empty-state-small">Nenhuma meta em andamento</p>';
    }

    // Category chart
    renderCategoryChart(goals);

    // Recent achievements
    const recentAchievements = document.getElementById('recent-achievements');
    const unlocked = state.unlockedAchievements;
    if (unlocked.length > 0) {
        const recent = unlocked.slice(-3).reverse();
        recentAchievements.innerHTML = recent.map(id => {
            const a = ACHIEVEMENTS.find(ach => ach.id === id);
            if (!a) return '';
            return `<div class="mini-achievement-item">
                <span class="mini-achievement-icon">${a.icon}</span>
                <div>
                    <div class="mini-achievement-name">${a.name}</div>
                    <div class="mini-achievement-desc">${a.desc}</div>
                </div>
            </div>`;
        }).join('');
    } else {
        recentAchievements.innerHTML = '<p class="empty-state-small">Nenhuma conquista ainda</p>';
    }
}

// ==================== CHART ====================
function renderCategoryChart(goals) {
    const canvas = document.getElementById('category-chart');
    const emptyMsg = document.getElementById('chart-empty');
    const legendEl = document.getElementById('chart-legend');

    if (goals.length === 0) {
        canvas.style.display = 'none';
        legendEl.style.display = 'none';
        emptyMsg.style.display = '';
        return;
    }

    canvas.style.display = '';
    legendEl.style.display = '';
    emptyMsg.style.display = 'none';

    const categoryCounts = {};
    goals.forEach(g => {
        categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    });

    const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const total = goals.length;

    const ctx = canvas.getContext('2d');
    const size = 220;
    canvas.width = size * 2; // retina
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 85;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);

    entries.forEach(([catId, count]) => {
        const cat = getCategoryById(catId);
        const sliceAngle = (count / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = cat.color;
        ctx.fill();

        startAngle += sliceAngle;
    });

    // Inner circle for donut effect
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim();
    ctx.fill();

    // Center text
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 8);
    ctx.font = '12px Inter';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
    ctx.fillText('metas', cx, cy + 12);

    // Legend
    legendEl.innerHTML = entries.map(([catId, count]) => {
        const cat = getCategoryById(catId);
        return `<span class="chart-legend-item">
            <span class="chart-legend-dot" style="background:${cat.color}"></span>
            ${cat.icon} ${cat.name} (${count})
        </span>`;
    }).join('');
}

// ==================== NOTIFICATIONS ====================
function addNotification(text) {
    const state = getState();
    const notification = {
        id: generateId(),
        text,
        time: new Date().toISOString(),
        read: false
    };
    state.notifications.unshift(notification);
    if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);
    save('notifications', state.notifications);
    updateNotificationBell();
}

function updateNotificationBell() {
    const state = getState();
    const unread = state.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-count');
    if (unread > 0) {
        badge.textContent = unread > 9 ? '9+' : unread;
        badge.style.display = '';
    } else {
        badge.style.display = 'none';
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('active');

    if (panel.classList.contains('active')) {
        renderNotifications();
        // Mark all as read
        const state = getState();
        state.notifications.forEach(n => n.read = true);
        save('notifications', state.notifications);
        updateNotificationBell();
    }
}

function renderNotifications() {
    const state = getState();
    const list = document.getElementById('notification-list');

    if (state.notifications.length === 0) {
        list.innerHTML = '<p class="empty-state-small">Nenhuma notificação</p>';
        return;
    }

    list.innerHTML = state.notifications.slice(0, 20).map(n => {
        const time = getRelativeTime(n.time);
        return `<div class="notification-item ${n.read ? '' : 'unread'}">
            <div>
                <div class="notification-text">${n.text}</div>
                <div class="notification-time">${time}</div>
            </div>
        </div>`;
    }).join('');
}

function clearNotifications() {
    save('notifications', []);
    updateNotificationBell();
    renderNotifications();
    showToast('Notificações limpas', 'info');
}

function getRelativeTime(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
}

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notification-panel');
    const bell = document.getElementById('notification-bell');
    if (panel.classList.contains('active') && !panel.contains(e.target) && !bell.contains(e.target)) {
        panel.classList.remove('active');
    }
});

// ==================== SETTINGS ====================
function populateCategorySelects() {
    const categories = getAllCategories();
    const options = categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');

    // Filter selects
    const filterCat = document.getElementById('filter-category');
    if (filterCat) {
        filterCat.innerHTML = '<option value="">Todas as categorias</option>' + options;
    }

    // Suggestion filter
    const sugCat = document.getElementById('suggestion-category-filter');
    if (sugCat) {
        sugCat.innerHTML = '<option value="">Todas as categorias</option>' + options;
    }
}

function loadSettingsValues() {
    const state = getState();
    const settings = state.settings;

    document.getElementById('couple-name').value = settings.coupleName || '';
    document.getElementById('anniversary-date').value = settings.anniversaryDate || '';

    // Partner status
    const user = state.currentUser;
    const statusEl = document.getElementById('partner-status');
    const inviteEl = document.getElementById('settings-invite-code');

    if (user?.coupleId) {
        const couple = state.couples.find(c => c.id === user.coupleId);
        const partnerId = couple?.user1 === user.id ? couple?.user2 : couple?.user1;
        const partner = state.users.find(u => u.id === partnerId);
        statusEl.textContent = partner ? `Conectado com ${partner.name}` : 'Conectado como casal';
        inviteEl.style.display = 'none';
    } else {
        statusEl.textContent = 'Compartilhe seu código para conectar com seu par:';
        inviteEl.style.display = '';
        document.getElementById('settings-invite-text').textContent = user?.inviteCode || '';
    }

    // Avatar
    if (settings.avatarData) {
        document.getElementById('settings-avatar').innerHTML = `<img src="${settings.avatarData}" alt="Avatar">`;
        document.getElementById('header-avatar-text').innerHTML = `<img src="${settings.avatarData}" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover">`;
    }

    renderCustomCategories();
}

function saveCoupleSettings() {
    const state = getState();
    state.settings.coupleName = document.getElementById('couple-name').value.trim();
    state.settings.anniversaryDate = document.getElementById('anniversary-date').value;
    save('settings', state.settings);
    showToast('Configurações salvas!', 'success');
    updateHeaderInfo();
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        return showToast('Imagem muito grande. Máximo 2MB.', 'error');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const state = getState();
        state.settings.avatarData = e.target.result;
        save('settings', state.settings);
        loadSettingsValues();
        showToast('Foto atualizada!', 'success');
    };
    reader.readAsDataURL(file);
}

function changePassword() {
    const newPass = document.getElementById('change-password').value;
    const confirm = document.getElementById('change-password-confirm').value;

    if (!newPass || newPass.length < 6) return showToast('Senha deve ter no mínimo 6 caracteres', 'error');
    if (newPass !== confirm) return showToast('As senhas não coincidem', 'error');

    const state = getState();
    const idx = state.users.findIndex(u => u.id === state.currentUser.id);
    if (idx !== -1) {
        state.users[idx].password = btoa(newPass);
        save('users', state.users);
        document.getElementById('change-password').value = '';
        document.getElementById('change-password-confirm').value = '';
        showToast('Senha alterada com sucesso!', 'success');
    }
}

function deleteAccount() {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível!')) return;
    if (!confirm('Todos os dados serão perdidos. Confirma a exclusão?')) return;

    const state = getState();
    const users = state.users.filter(u => u.id !== state.currentUser.id);
    save('users', users);
    save('currentUser', null);

    // Clear couple-specific data if no partner remains
    save('goals', []);
    save('notifications', []);
    save('achievements', []);
    saveSimple('xp', 0);
    save('settings', {});
    save('addedSuggestions', []);
    save('customCategories', []);

    showToast('Conta excluída', 'info');
    showPage('auth-page');
    showAuthForm('login-form');
}

// ==================== CUSTOM CATEGORIES ====================
function addCustomCategory() {
    const name = document.getElementById('new-category-name').value.trim();
    const color = document.getElementById('new-category-color').value;

    if (!name) return showToast('Informe o nome da categoria', 'error');

    const state = getState();
    if (state.customCategories.length >= 5) {
        return showToast('Máximo de 5 categorias personalizadas', 'error');
    }

    const id = 'custom_' + generateId();
    state.customCategories.push({ id, name, icon: '📌', color });
    save('customCategories', state.customCategories);

    document.getElementById('new-category-name').value = '';
    renderCustomCategories();
    populateCategorySelects();
    showToast(`Categoria "${name}" criada!`, 'success');
}

function removeCustomCategory(id) {
    const state = getState();
    const cats = state.customCategories.filter(c => c.id !== id);
    save('customCategories', cats);
    renderCustomCategories();
    populateCategorySelects();
}

function renderCustomCategories() {
    const state = getState();
    const container = document.getElementById('custom-categories-list');

    if (state.customCategories.length === 0) {
        container.innerHTML = '<p class="empty-state-small" style="padding:8px">Nenhuma categoria personalizada</p>';
    } else {
        container.innerHTML = state.customCategories.map(c =>
            `<div class="custom-category-item">
                <span class="custom-category-dot" style="background:${c.color}"></span>
                <span class="custom-category-name">${escapeHtml(c.name)}</span>
                <button class="btn btn-icon-only" onclick="removeCustomCategory('${c.id}')" title="Remover">✕</button>
            </div>`
        ).join('');
    }

    // Show/hide add form based on limit
    const addForm = document.getElementById('add-category-form');
    if (addForm) {
        addForm.style.display = state.customCategories.length >= 5 ? 'none' : '';
    }
}

// ==================== DEADLINE NOTIFICATIONS ====================
function checkDeadlineNotifications() {
    const state = getState();
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    state.goals.forEach(goal => {
        if (goal.targetDate && goal.status !== 'done') {
            if (goal.targetDate <= threeDaysStr && goal.targetDate >= todayStr) {
                // Check if we already notified today
                const notifKey = `deadline_${goal.id}_${todayStr}`;
                if (!localStorage.getItem(DB_KEY + notifKey)) {
                    addNotification(`⏰ A meta "${goal.title}" está próxima do prazo! (${formatDate(goal.targetDate)})`);
                    localStorage.setItem(DB_KEY + notifKey, '1');
                }
            }
        }
    });
}

// ==================== SECURITY ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== PASSWORD STRENGTH INDICATOR ====================
document.getElementById('register-password')?.addEventListener('input', function () {
    const strength = document.getElementById('password-strength');
    const val = this.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    const widths = ['20%', '40%', '60%', '80%', '100%'];

    if (val.length === 0) {
        strength.innerHTML = '';
    } else {
        strength.innerHTML = `<div class="strength-bar" style="width:${widths[score - 1] || '10%'};background:${colors[score - 1] || '#ef4444'}"></div>`;
    }
});

// ==================== INITIALIZATION ====================
function init() {
    loadTheme();

    const state = getState();
    if (state.currentUser) {
        // Check if user still exists in users array
        const userExists = state.users.find(u => u.id === state.currentUser.id);
        if (userExists) {
            if (!state.currentUser.coupleId && !userExists.coupleId) {
                showOnboardingPage();
            } else {
                // Update currentUser with latest data
                save('currentUser', userExists);
                showAppPage();
                checkDeadlineNotifications();
            }
        } else {
            save('currentUser', null);
            showPage('auth-page');
        }
    } else {
        showPage('auth-page');
    }

    // Check for invite code in URL params
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('code');
    if (inviteCode) {
        document.getElementById('invite-code-input').value = inviteCode;
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', init);

// Handle Enter key on forms
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const target = e.target;
        if (target.id === 'login-email' || target.id === 'login-password') handleLogin();
        if (target.id === 'invite-code-input') handleJoinCouple();
    }
});

// Close modals on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGoalModal();
        closeDetailModal();
        closeCelebration();
        document.querySelector('.surprise-overlay')?.remove();
        document.getElementById('notification-panel').classList.remove('active');
    }
});

// Close modals on overlay click
document.getElementById('goal-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'goal-modal') closeGoalModal();
});

document.getElementById('goal-detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'goal-detail-modal') closeDetailModal();
});

document.getElementById('celebration-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'celebration-overlay') closeCelebration();
});
