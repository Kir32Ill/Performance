document.addEventListener("DOMContentLoaded", () => {
    const TABS = {
        all: {
            title: 'Все',
            items: generateItems(64, [
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
                { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
                { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' },
                { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
                { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' }
            ])
        },
        kitchen: {
            title: 'Кухня',
            items: [
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
                { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' }
            ]
        },
        hall: {
            title: 'Зал',
            items: [
                { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Выключено' },
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Выключено' }
            ]
        },
        lights: {
            title: 'Лампочки',
            items: [
                { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
                { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' }
            ]
        },
        cameras: {
            title: 'Камеры',
            items: [
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' }
            ]
        }
    };

    function generateItems(count, baseItems) {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(...baseItems);
        }
        return result;
    }
    const state = {
        activeTab: '',
        expandedMenu: false,
        toggledMenu: false,
        hasRightScroll: false
    };
    const elements = {
        app: document.getElementById('app'),
        resizeObserver: new ResizeObserver(handleResize)
    };
    function init() {
        const params = new URLSearchParams(window.location.search);
        state.activeTab = params.get('tab') || 'all';
        renderApp();
    }
    function renderApp() {
        elements.app.innerHTML = `
            ${renderHeader()}
            ${renderMain()}
        `;
        initMenuToggle();
        initTabSwitcher();
        initDevicePanels();
    }

    function renderHeader() {
        return `
            <header class="header">
                <a href="/" class="header__logo" aria-label="Яндекс.Дом"></a>
                <button class="header__menu" aria-expanded="${state.expandedMenu}">
                    <span class="header__menu-text a11y-hidden">
                        ${state.expandedMenu ? 'Закрыть меню' : 'Открыть меню'}
                    </span>
                </button>
                <ul class="header__links ${state.expandedMenu ? 'header__links_opened' : ''} ${state.toggledMenu ? 'header__links-toggled' : ''}">
                    <li class="header__item">
                        <a class="header__link header__link_current" href="/" aria-current="page">Сводка</a>
                    </li>
                    <li class="header__item">
                        <a class="header__link" href="/devices">Устройства</a>
                    </li>
                    <li class="header__item">
                        <a class="header__link" href="/scripts">Сценарии</a>
                    </li>
                </ul>
            </header>
        `;
    }

    function renderMain() {
        return `
            <main class="main">
                ${renderGeneralSection()}
                ${renderScriptsSection()}
                ${renderDevicesSection()}
            </main>
        `;
    }

    function renderGeneralSection() {
        return `
            <section class="section main__general">
                <h2 class="section__title section__title-header section__main-title">Главное</h2>
                <div class="hero-dashboard">
                    <div class="hero-dashboard__primary">
                        <h3 class="hero-dashboard__title">Привет, Геннадий!</h3>
                        <p class="hero-dashboard__subtitle">Двери и окна закрыты, сигнализация включена.</p>
                        <ul class="hero-dashboard__info">
                            <li class="hero-dashboard__item">
                                <div class="hero-dashboard__item-title">Дома</div>
                                <div class="hero-dashboard__item-details">
                                    +23<span class="a11y-hidden">°</span>
                                </div>
                            </li>
                            <li class="hero-dashboard__item">
                                <div class="hero-dashboard__item-title">За окном</div>
                                <div class="hero-dashboard__item-details">
                                    +19<span class="a11y-hidden">°</span>
                                    <div class="hero-dashboard__icon hero-dashboard__icon_rain" role="img" aria-label="Дождь"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <ul class="hero-dashboard__schedule">
                        ${renderEvent({ icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' })}
                        ${renderEvent({ icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' })}
                        ${renderEvent({ icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' })}
                    </ul>
                </div>
            </section>
        `;
    }

    function renderScriptsSection() {
        return `
            <section class="section main__scripts">
                <h2 class="section__title section__title-header">Избранные сценарии</h2>
                <ul class="event-grid">
                    ${renderEvent({ slim: true, icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет в доме и во дворе' })}
                    ${renderEvent({ slim: true, icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу' })}
                    ${renderEvent({ slim: true, icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре' })}
                    ${renderEvent({ slim: true, icon: 'temp2', iconLabel: 'Температура', title: 'Набрать горячую ванну', subtitle: 'Начнётся в 18:00' })}
                    ${renderEvent({ slim: true, icon: 'temp2', iconLabel: 'Температура', title: 'Сделать пол тёплым во всей квартире' })}
                </ul>
            </section>
        `;
    }

    function renderDevicesSection() {
        return `
            <section class="section main__devices">
                <div class="section__title">
                    <h2 class="section__title-header">Избранные устройства</h2>
                    <select class="section__select" onchange="handleTabChange(this.value)">
                        ${Object.keys(TABS).map(key => `
                            <option value="${key}" ${key === state.activeTab ? 'selected' : ''}>${TABS[key].title}</option>
                        `).join('')}
                    </select>
                    <ul class="section__tabs" role="tablist">
                        ${Object.keys(TABS).map(key => `
                            <li class="section__tab ${key === state.activeTab ? 'section__tab_active' : ''}" 
                                role="tab" 
                                aria-selected="${key === state.activeTab}"
                                onclick="handleTabChange('${key}')">
                                ${TABS[key].title}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="section__panel-wrapper" id="panelWrapper">
                    ${Object.keys(TABS).map(key => `
                        <div class="section__panel ${key === state.activeTab ? '' : 'section__panel_hidden'}" 
                            role="tabpanel" 
                            aria-hidden="${key !== state.activeTab}"
                            id="panel_${key}">
                            <ul class="section__panel-list">
                                ${TABS[key].items.map(item => renderEvent(item)).join('')}
                            </ul>
                        </div>
                    `).join('')}
                    ${state.hasRightScroll ? '<div class="section__arrow" onclick="scrollRight()"></div>' : ''}
                </div>
            </section>
        `;
    }

    function renderEvent({ slim, icon, iconLabel, title, subtitle }) {
        return `
            <li class="event ${slim ? 'event_slim' : ''}">
                <button class="event__button">
                    <span class="event__icon event__icon_${icon}" role="img" aria-label="${iconLabel}"></span>
                    <h4 class="event__title">${title}</h4>
                    ${subtitle ? `<span class="event__subtitle">${subtitle}</span>` : ''}
                </button>
            </li>
        `;
    }

    function initMenuToggle() {
        const menuBtn = document.querySelector('.header__menu');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                state.toggledMenu = state.toggledMenu || true;
                state.expandedMenu = !state.expandedMenu;
                document.querySelector('.header__links').className = 
                    `header__links ${state.expandedMenu ? 'header__links_opened' : ''} ${state.toggledMenu ? 'header__links-toggled' : ''}`;
                menuBtn.setAttribute('aria-expanded', state.expandedMenu);
                document.querySelector('.header__menu-text').textContent = 
                    state.expandedMenu ? 'Закрыть меню' : 'Открыть меню';
            });
        }
    }

    function initTabSwitcher() {
        window.handleTabChange = (tab) => {
            state.activeTab = tab;
            state.hasRightScroll = false;
            
            const wrapper = document.getElementById('panelWrapper');
            if (wrapper) {
                wrapper.innerHTML = `
                    ${Object.keys(TABS).map(key => `
                        <div class="section__panel ${key === tab ? '' : 'section__panel_hidden'}" 
                            role="tabpanel" 
                            aria-hidden="${key !== tab}"
                            id="panel_${key}">
                            <ul class="section__panel-list">
                                ${TABS[key].items.map(item => renderEvent(item)).join('')}
                            </ul>
                        </div>
                    `).join('')}
                `;
                
                initDevicePanels();
            }
            
            document.querySelectorAll('.section__tab').forEach(el => {
                const isActive = el.textContent === TABS[tab].title;
                el.classList.toggle('section__tab_active', isActive);
                el.setAttribute('aria-selected', isActive);
            });
            
            const select = document.querySelector('.section__select');
            if (select) select.value = tab;
        };
    }

    function initDevicePanels() {
        const activePanel = document.querySelector(`#panel_${state.activeTab}`);
        if (activePanel) {
            elements.resizeObserver.observe(activePanel);
            checkScrollNeeded();
        }
    }

    function handleResize(entries) {
        entries.forEach(entry => {
            if (entry.target.id === `panel_${state.activeTab}`) {
                checkScrollNeeded();
            }
        });
    }

    function checkScrollNeeded() {
        const panel = document.querySelector(`#panel_${state.activeTab}`);
        if (!panel) return;
        
        const list = panel.querySelector('.section__panel-list');
        const needsScroll = list.scrollWidth > panel.offsetWidth;
        
        if (needsScroll !== state.hasRightScroll) {
            state.hasRightScroll = needsScroll;
            const wrapper = document.querySelector('.section__panel-wrapper');
            if (wrapper) {
                if (needsScroll) {
                    wrapper.insertAdjacentHTML('beforeend', '<div class="section__arrow" onclick="scrollRight()"></div>');
                } else {
                    const arrow = wrapper.querySelector('.section__arrow');
                    if (arrow) arrow.remove();
                }
            }
        }
    }

    window.scrollRight = () => {
        const panel = document.querySelector(`.section__panel:not(.section__panel_hidden)`);
        if (panel) {
            panel.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    init();
});