document.addEventListener("DOMContentLoaded", () => {
    const baseItems = [
        { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
        { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
        { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' },
        { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
        { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
        { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' }
    ];

    const TABS = {
        all: { title: 'Все', items: [] },
        kitchen: { title: 'Кухня', items: [baseItems[0], baseItems[2]] },
        hall: { title: 'Зал', items: [baseItems[4], baseItems[5]] },
        lights: { title: 'Лампочки', items: [baseItems[1], baseItems[3], baseItems[4]] },
        cameras: { title: 'Камеры', items: [baseItems[4]] }
    };

    for (let i = 0; i < 9; i++) {
        TABS.all.items = [...TABS.all.items, ...baseItems.map(item => ({...item}))];
    }

    const state = {
        activeTab: '',
        expandedMenu: false,
        toggledMenu: false,
        hasRightScroll: false,
        sizes: []
    };

    const dom = {
        app: document.getElementById('app'),
        resizeObserver: new ResizeObserver(entries => {
            const sumWidth = state.sizes.reduce((acc, size) => acc + size.width, 0);
            const panelWrapper = document.querySelector('.section__panel-wrapper');
            if (panelWrapper) {
                const needsScroll = sumWidth > panelWrapper.offsetWidth;
                if (needsScroll !== state.hasRightScroll) {
                    state.hasRightScroll = needsScroll;
                    updateScrollArrow();
                }
            }
        })
    };

    function createElement(tag, className, attributes = {}) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
        return el;
    }

    function renderEvent({ slim, icon, iconLabel, title, subtitle }, onSize) {
        const li = createElement('li', `event${slim ? ' event_slim' : ''}`);
        const button = createElement('button', 'event__button');
        
        const iconSpan = createElement('span', `event__icon event__icon_${icon}`, {
            'role': 'img',
            'aria-label': iconLabel
        });
        
        const titleHeading = createElement('h4', 'event__title');
        titleHeading.textContent = title;
        
        button.append(iconSpan, titleHeading);
        
        if (subtitle) {
            const subtitleSpan = createElement('span', 'event__subtitle');
            subtitleSpan.textContent = subtitle;
            button.appendChild(subtitleSpan);
        }
        
        li.appendChild(button);
        
        if (onSize) {
            dom.resizeObserver.observe(li);
            state.sizes.push({
                width: li.offsetWidth,
                height: li.offsetHeight
            });
        }
        
        return li;
    }

    function renderHeader() {
        const header = createElement('header', 'header');
        const logoLink = createElement('a', 'header__logo', {
            'href': '/',
            'aria-label': 'Яндекс.Дом'
        });
        
        const menuButton = createElement('button', 'header__menu', {
            'aria-expanded': state.expandedMenu
        });
        
        const menuText = createElement('span', 'header__menu-text a11y-hidden');
        menuText.textContent = state.expandedMenu ? 'Закрыть меню' : 'Открыть меню';
        menuButton.appendChild(menuText);
        
        const links = createElement('ul', `header__links${state.expandedMenu ? ' header__links_opened' : ''}${state.toggledMenu ? ' header__links-toggled' : ''}`);
        
        const linksItems = [
            { text: 'Сводка', current: true },
            { text: 'Устройства', href: '/devices' },
            { text: 'Сценарии', href: '/scripts' }
        ];
        
        linksItems.forEach(item => {
            const li = createElement('li', 'header__item');
            const a = createElement('a', `header__link${item.current ? ' header__link_current' : ''}`, {
                'href': item.href || '/',
                ...(item.current && { 'aria-current': 'page' })
            });
            a.textContent = item.text;
            li.appendChild(a);
            links.appendChild(li);
        });
        
        header.append(logoLink, menuButton, links);
        return header;
    }

    function renderMain() {
        const main = createElement('main', 'main');
        
        const generalSection = createElement('section', 'section main__general');
        generalSection.innerHTML = `
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
                <ul class="hero-dashboard__schedule"></ul>
            </div>
        `;
        
        const scheduleItems = [
            { icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' }
        ];
        
        const scheduleList = generalSection.querySelector('.hero-dashboard__schedule');
        scheduleItems.forEach(item => {
            scheduleList.appendChild(renderEvent(item));
        });
        
        const scriptsSection = createElement('section', 'section main__scripts');
        scriptsSection.innerHTML = `
            <h2 class="section__title section__title-header">Избранные сценарии</h2>
            <ul class="event-grid"></ul>
        `;
        
        const scriptItems = [
            { slim: true, icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет в доме и во дворе' },
            { slim: true, icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу' },
            { slim: true, icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре' },
            { slim: true, icon: 'temp2', iconLabel: 'Температура', title: 'Набрать горячую ванну', subtitle: 'Начнётся в 18:00' },
            { slim: true, icon: 'temp2', iconLabel: 'Температура', title: 'Сделать пол тёплым во всей квартире' }
        ];
        
        const scriptsList = scriptsSection.querySelector('.event-grid');
        scriptItems.forEach(item => {
            scriptsList.appendChild(renderEvent(item));
        });
        
        const devicesSection = createElement('section', 'section main__devices');
        devicesSection.innerHTML = `
            <div class="section__title">
                <h2 class="section__title-header">Избранные устройства</h2>
                <select class="section__select">
                    ${Object.keys(TABS).map(key => `
                        <option value="${key}">${TABS[key].title}</option>
                    `).join('')}
                </select>
                <ul class="section__tabs" role="tablist"></ul>
            </div>
            <div class="section__panel-wrapper"></div>
        `;
        
        const tabsList = devicesSection.querySelector('.section__tabs');
        Object.keys(TABS).forEach(key => {
            const tab = createElement('li', `section__tab${key === state.activeTab ? ' section__tab_active' : ''}`, {
                'role': 'tab',
                'aria-selected': key === state.activeTab,
                'data-tab': key
            });
            tab.textContent = TABS[key].title;
            tabsList.appendChild(tab);
        });
        
        const panelWrapper = devicesSection.querySelector('.section__panel-wrapper');
        renderDevicePanels(panelWrapper);
        
        main.append(generalSection, scriptsSection, devicesSection);
        return main;
    }

    function renderDevicePanels(wrapper) {
        wrapper.innerHTML = '';
        state.sizes = [];
        
        Object.keys(TABS).forEach(key => {
            const panel = createElement('div', `section__panel${key === state.activeTab ? '' : ' section__panel_hidden'}`, {
                'role': 'tabpanel',
                'aria-hidden': key !== state.activeTab,
                'id': `panel_${key}`,
                'aria-labelledby': `tab_${key}`
            });
            
            const list = createElement('ul', 'section__panel-list');
            TABS[key].items.forEach((item, index) => {
                list.appendChild(renderEvent(item, key === state.activeTab));
            });
            
            panel.appendChild(list);
            wrapper.appendChild(panel);
        });
        
        updateScrollArrow();
    }

    function updateScrollArrow() {
        const wrapper = document.querySelector('.section__panel-wrapper');
        if (!wrapper) return;
        
        const existingArrow = wrapper.querySelector('.section__arrow');
        if (state.hasRightScroll && !existingArrow) {
            const arrow = createElement('div', 'section__arrow');
            arrow.onclick = scrollRight;
            wrapper.appendChild(arrow);
        } else if (!state.hasRightScroll && existingArrow) {
            existingArrow.remove();
        }
    }

    function scrollRight() {
        const panel = document.querySelector(`.section__panel:not(.section__panel_hidden)`);
        if (panel) {
            panel.scrollBy({ left: 400, behavior: 'smooth' });
        }
    }

    function setupTabHandlers() {
        const select = document.querySelector('.section__select');
        if (select) {
            select.value = state.activeTab;
            select.addEventListener('change', (e) => {
                state.activeTab = e.target.value;
                state.sizes = [];
                const wrapper = document.querySelector('.section__panel-wrapper');
                if (wrapper) renderDevicePanels(wrapper);
                updateTabsUI();
            });
        }
        
        document.querySelectorAll('.section__tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.activeTab = tab.dataset.tab;
                state.sizes = [];
                const wrapper = document.querySelector('.section__panel-wrapper');
                if (wrapper) renderDevicePanels(wrapper);
                updateTabsUI();
            });
        });
    }

    function updateTabsUI() {
        const select = document.querySelector('.section__select');
        if (select) select.value = state.activeTab;
        
        document.querySelectorAll('.section__tab').forEach(tab => {
            const isActive = tab.dataset.tab === state.activeTab;
            tab.classList.toggle('section__tab_active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
    }

    function toggleMenu() {
        state.toggledMenu = true;
        state.expandedMenu = !state.expandedMenu;
        
        const links = document.querySelector('.header__links');
        if (links) {
            links.className = `header__links${state.expandedMenu ? ' header__links_opened' : ''}${state.toggledMenu ? ' header__links-toggled' : ''}`;
        }
        
        const menuButton = document.querySelector('.header__menu');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', state.expandedMenu);
            const menuText = menuButton.querySelector('.header__menu-text');
            if (menuText) {
                menuText.textContent = state.expandedMenu ? 'Закрыть меню' : 'Открыть меню';
            }
        }
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        state.activeTab = params.get('tab') || 'all';
        
        dom.app.appendChild(renderHeader());
        dom.app.appendChild(renderMain());
        
        document.querySelector('.header__menu').addEventListener('click', toggleMenu);
        setupTabHandlers();
    }

    init();
});