// ============ НАВИГАЦИЯ ============
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

function showSection(sectionId) {
    // Скрыть все секции
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Показать выбранную секцию
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Обновить активную ссылку
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Прокрутить вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        showSection(link.dataset.section);
    });
});

// Клик по карточкам на главной
document.querySelectorAll('.safety-card[data-target]').forEach(card => {
    card.addEventListener('click', () => {
        showSection(card.dataset.target);
    });
});

// ============ ЧЕК-ЛИСТ ============
const checklistItems = [
    // Физическая безопасность
    { id: 'ch1', text: 'Правильная осанка за рабочим столом', category: 'physical' },
    { id: 'ch2', text: 'Монитор на уровне глаз', category: 'physical' },
    { id: 'ch3', text: 'Достаточное освещение', category: 'physical' },
    { id: 'ch4', text: 'Сделал перерыв для глаз (20-20-20)', category: 'physical' },
    { id: 'ch5', text: 'Разминка для спины и шеи', category: 'physical' },
    { id: 'ch6', text: 'Проветрил помещение', category: 'physical' },
    // Цифровая безопасность
    { id: 'ch7', text: 'Использую менеджер паролей', category: 'digital' },
    { id: 'ch8', text: 'Включена двухфакторная аутентификация', category: 'digital' },
    { id: 'ch9', text: 'Проверил обновления системы', category: 'digital' },
    { id: 'ch10', text: 'VPN включен (в публичной сети)', category: 'digital' },
    { id: 'ch11', text: 'Резервная копия создана', category: 'digital' },
    { id: 'ch12', text: 'Экран заблокирован при отходе', category: 'digital' },
    { id: 'ch13', text: 'Проверил подозрительные письма', category: 'digital' },
    { id: 'ch14', text: 'Не коммитил секретные данные', category:'digital' },
    { id: 'ch15', text: 'Обновил зависимости проекта', category: 'digital' }
];

function generateChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;

    const physicalItems = checklistItems.filter(item => item.category === 'physical');
    const digitalItems = checklistItems.filter(item => item.category === 'digital');

    let html = '<div class="safety-grid">';

    // Физическая безопасность
    html += '<div class="safety-card"><h3><span class="icon">💪</span> Физическая безопасность</h3><ul class="checklist">';
    physicalItems.forEach(item => {
        html += `
            <li>
                <input type="checkbox" id="${item.id}">
                <label for="${item.id}">${item.text}</label>
            </li>
        `;
    });
    html += '</ul></div>';

    // Цифровая безопасность
    html += '<div class="safety-card"><h3><span class="icon">🔒</span> Цифровая безопасность</h3><ul class="checklist">';
    digitalItems.forEach(item => {
        html += `
            <li>
                <input type="checkbox" id="${item.id}">
                <label for="${item.id}">${item.text}</label>
            </li>
        `;
    });
    html += '</ul></div>';

    html += '</div>';
    container.innerHTML = html;

    // Обработчики чекбоксов
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });

    // Восстановление состояния
    loadChecklistState();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
    const checked = document.querySelectorAll('#checklistContainer input[type="checkbox"]:checked').length;
    const total = checkboxes.length;
    const percentage = total ? Math.round((checked / total) * 100) : 0;

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = percentage + '%';
    }

    saveChecklistState();
}

function saveChecklistState() {
    const state = {};
    checklistItems.forEach(item => {
        const checkbox = document.getElementById(item.id);
        if (checkbox) {
            state[item.id] = checkbox.checked;
        }
    });
    localStorage.setItem('safetyChecklist', JSON.stringify(state));
}

function loadChecklistState() {
    const saved = localStorage.getItem('safetyChecklist');
    if (!saved) return;

    try {
        const state = JSON.parse(saved);
        Object.keys(state).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = state[id];
            }
        });
        updateProgress();
    } catch (e) {
        console.error('Ошибка загрузки состояния чек-листа:', e);
    }
}

const resetChecklistBtn = document.getElementById('resetChecklistBtn');
if (resetChecklistBtn) {
    resetChecklistBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить весь чек-лист?')) {
            document.querySelectorAll('#checklistContainer input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            localStorage.removeItem('safetyChecklist');
            updateProgress();
        }
    });
}

// ============ ТЕСТ ============
const quizQuestions = [
    {
        question: 'Как часто нужно делать перерыв при работе за компьютером?',
        options: [
            'Каждые 2-3 часа',
            'Каждые 45-60 минут',
            'Только когда устанешь',
            'Раз в день'
        ],
        correct: 1
    },
    {
        question: 'Что такое правило 20-20-20?',
        options: [
            '20 минут работы, 20 минут отдыха, 20 минут сна',
            'Каждые 20 минут смотреть на 20 футов в течение 20 секунд',
            '20 упражнений, 20 повторений, 20 подходов',
            '20 дней работы, 20 дней отдыха'
        ],
        correct: 1
    },
    {
        question: 'Что делать, если вы работаете в публичной Wi-Fi сети?',
        options: [
            'Ничего, это безопасно',
            'Использовать VPN',
            'Просто не заходить на важные сайты',
            'Отключить firewall'
        ],
        correct: 1
    },
    {
        question: 'Можно ли хранить пароли в текстовом файле?',
        options: [
            'Да, если файл на рабочем столе',
            'Да, если назвать файл "не пароли"',
            'Нет, используйте менеджер паролей',
            'Да, это удобно'
        ],
        correct: 2
    },
    {
        question: 'Что нужно сделать перед коммитом кода?',
        options: [
            'Ничего, просто закоммитить',
            'Проверить, нет ли секретных ключей и паролей',
            'Удалить весь код',
            'Отправить коллеге'
        ],
        correct: 1
    },
    {
        question: 'Как часто нужно обновлять программное обеспечение?',
        options: [
            'Никогда, это может сломать систему',
            'Раз в год',
            'Регулярно, по мере выхода обновлений',
            'Только когда перестанет работать'
        ],
        correct: 2
    },
    {
        question: 'Что делать при получении подозрительного письма?',
        options: [
            'Открыть и посмотреть',
            'Переслать коллегам',
            'Не открывать, сообщить в службу безопасности',
            'Ответить отправителю'
        ],
        correct: 2
    },
    {
        question: 'Какой должна быть высота монитора?',
        options: [
            'На уровне глаз или чуть ниже',
            'На уровне колен',
            'Как можно выше',
            'Не имеет значения'
        ],
        correct: 0
    },
    {
        question: 'Что такое двухфакторная аутентификация?',
        options: [
            'Два пароля',
            'Пароль + дополнительный код подтверждения',
            'Два аккаунта',
            'Два компьютера'
        ],
        correct: 1
    },
    {
        question: 'Зачем нужно резервное копирование?',
        options: [
            'Для экономии места',
            'Для защиты от потери данных',
            'Для ускорения работы',
            'Это не нужно'
        ],
        correct: 1
    }
];

let userAnswers = {};

function generateQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    let html = '';

    quizQuestions.forEach((q, index) => {
        html += `
            <div class="quiz-question">
                <h4>Вопрос ${index + 1}: ${q.question}</h4>
                <div class="quiz-options">
        `;
        q.options.forEach((option, optIndex) => {
            html += `
                <div class="quiz-option" data-question="${index}" data-option="${optIndex}">
                    ${option}
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Обработчики выбора вариантов
    container.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
            const qIndex = parseInt(option.dataset.question);
            const oIndex = parseInt(option.dataset.option);
            selectOption(qIndex, oIndex);
        });
    });
}

function selectOption(questionIndex, optionIndex) {
    // Убрать выделение с других вариантов этого вопроса
    document.querySelectorAll(`.quiz-option[data-question="${questionIndex}"]`).forEach(opt => {
        opt.classList.remove('selected');
    });

    // Выделить выбранный вариант
    const selected = document.querySelector(
        `.quiz-option[data-question="${questionIndex}"][data-option="${optionIndex}"]`
    );
    if (selected) {
        selected.classList.add('selected');
    }

    userAnswers[questionIndex] = optionIndex;
}

function checkQuiz() {
    let correct = 0;
    const
total = quizQuestions.length;

    quizQuestions.forEach((q, index) => {
        const options = document.querySelectorAll(`.quiz-option[data-question="${index}"]`);

        options.forEach((opt, optIndex) => {
            opt.classList.remove('correct', 'incorrect');

            if (optIndex === q.correct) {
                opt.classList.add('correct');
            } else if (userAnswers[index] === optIndex && optIndex !== q.correct) {
                opt.classList.add('incorrect');
            }
        });

        if (userAnswers[index] === q.correct) {
            correct++;
        }
    });

    const resultDiv = document.getElementById('quizResult');
    if (!resultDiv) return;

    const percentage = Math.round((correct / total) * 100);

    resultDiv.className = 'alert show';

    if (percentage >= 80) {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `🎉 Отлично! Вы ответили правильно на ${correct} из ${total} вопросов (${percentage}%). Вы хорошо знаете правила безопасности!`;
    } else if (percentage >= 50) {
        resultDiv.classList.add('warning');
        resultDiv.innerHTML = `📚 Неплохо! Вы ответили правильно на ${correct} из ${total} вопросов (${percentage}%). Рекомендуем повторить материал.`;
    } else {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `⚠️ Стоит повторить материал. Вы ответили правильно на ${correct} из ${total} вопросов (${percentage}%). Изучите разделы сайта внимательнее.`;
    }
}

function resetQuiz() {
    userAnswers = {};
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    const resultDiv = document.getElementById('quizResult');
    if (resultDiv) {
        resultDiv.classList.remove('show', 'success', 'warning', 'error');
        resultDiv.innerHTML = '';
    }
    generateQuiz();
}

const checkQuizBtn = document.getElementById('checkQuizBtn');
if (checkQuizBtn) {
    checkQuizBtn.addEventListener('click', checkQuiz);
}

const resetQuizBtn = document.getElementById('resetQuizBtn');
if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', resetQuiz);
}

// ============ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', () => {
    generateChecklist();
    generateQuiz();
});
