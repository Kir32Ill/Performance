const TABS = {
    all: {
        title: 'Все',
        items: [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
            { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
            { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' }
        ]
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
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' }
        ]
    },
    cameras: {
        title: 'Камеры',
        items: [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' }
        ]
    }
};

const TABS_KEYS = Object.keys(TABS);

function createElement(tagName, className, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    
    if (className) {
        element.className = className; 
    }

    if (attributes && typeof attributes === 'object') {
        for (const [key, value] of Object.entries(attributes)) {
            if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        }
    }

    if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === 'string') {
        element.appendChild(document.createTextNode(children));
    } else if (children instanceof Node) {
        element.appendChild(children);
    }

    return element;
}
function renderApp() {
    const app = document.getElementById('app');

    const header = createElement('header', 'header');
    header.appendChild(createElement('a', 'header__logo', { href: '/', 'aria-label': 'Яндекс.Дом' }));
    let expanded = false;
    let toggled = false;
    const menuButton = createElement(
        'button',
        'header__menu',
        { 'aria-expanded': 'false', onClick: () => toggleMenu() },
        [
            createElement('span', 'header__menu-text a11y-hidden', null, ['Открыть меню']),
        ]
    );
    header.appendChild(menuButton);

    const links = createElement('ul', 'header__links');
    links.appendChild(createElement('li', 'header__item', null, [
        createElement('a', 'header__link header__link_current', { href: '/', 'aria-current': 'page' }, ['Сводка'])
    ]));
    links.appendChild(createElement('li', 'header__item', null, [
        createElement('a', 'header__link', { href: '/devices' }, ['Устройства'])
    ]));
    links.appendChild(createElement('li', 'header__item', null, [
        createElement('a', 'header__link', { href: '/scripts' }, ['Сценарии'])
    ]));
    header.appendChild(links);

    app.appendChild(header);

    const main = createElement('main', 'main');

    const generalSection = createElement('section', 'section main__general');
    generalSection.appendChild(createElement('h2', 'section__title section__title-header section__main-title', null, ['Главное']));
    const heroDashboard = createElement('div', 'hero-dashboard');
    const primaryInfo = createElement('div', 'hero-dashboard__primary');
    primaryInfo.appendChild(createElement('h3', 'hero-dashboard__title', null, ['Привет, Геннадий!']));
    primaryInfo.appendChild(createElement('p', 'hero-dashboard__subtitle', null, ['Двери и окна закрыты, сигнализация включена.']));
    const infoList = createElement('ul', 'hero-dashboard__info');
    infoList.appendChild(createElement('li', 'hero-dashboard__item', null, [
        createElement('div', 'hero-dashboard__item-title', null, ['Дома']),
        createElement('div', 'hero-dashboard__item-details', null, ['+23', createElement('span', 'a11y-hidden', null, ['°'])])
    ]));
    infoList.appendChild(createElement('li', 'hero-dashboard__item', null, [
        createElement('div', 'hero-dashboard__item-title', null, ['За окном']),
        createElement('div', 'hero-dashboard__item-details', null, [
            '+19',
            createElement('span', 'a11y-hidden', null, ['°']),
            createElement('div', 'hero-dashboard__icon hero-dashboard__icon_rain', { role: 'img', 'aria-label': 'Дождь' })
        ])
    ]));
    primaryInfo.appendChild(infoList);
    heroDashboard.appendChild(primaryInfo);

    const scheduleList = createElement('ul', 'hero-dashboard__schedule');
    scheduleList.appendChild(createEvent({
        icon: 'temp',
        iconLabel: 'Температура',
        title: 'Philips Cooler',
        subtitle: 'Начнет охлаждать в 16:30'
    }));
    scheduleList.appendChild(createEvent({
        icon: 'light',
        iconLabel: 'Освещение',
        title: 'Xiaomi Yeelight LED Smart Bulb',
        subtitle: 'Включится в 17:00'
    }));
    scheduleList.appendChild(createEvent({
        icon: 'light',
        iconLabel: 'Освещение',
        title: 'Xiaomi Yeelight LED Smart Bulb',
        subtitle: 'Включится в 17:00'
    }));
    heroDashboard.appendChild(scheduleList);

    generalSection.appendChild(heroDashboard);
    main.appendChild(generalSection);

    const scriptsSection = createElement('section', 'section main__scripts');
    scriptsSection.appendChild(createElement('h2', 'section__title section__title-header', null, ['Избранные сценарии']));
    const eventGrid = createElement('ul', 'event-grid');
    eventGrid.appendChild(createSlimEvent({
        icon: 'light2',
        iconLabel: 'Освещение',
        title: 'Выключить весь свет в доме и во дворе'
    }));
    eventGrid.appendChild(createSlimEvent({
        icon: 'schedule',
        iconLabel: 'Расписание',
        title: 'Я ухожу'
    }));
    eventGrid.appendChild(createSlimEvent({
        icon: 'light2',
        iconLabel: 'Освещение',
        title: 'Включить свет в коридоре'
    }));
    eventGrid.appendChild(createSlimEvent({
        icon: 'temp2',
        iconLabel: 'Температура',
        title: 'Набрать горячую ванну',
        subtitle: 'Начнётся в 18:00'
    }));
    eventGrid.appendChild(createSlimEvent({
        icon: 'temp2',
        iconLabel: 'Температура',
        title: 'Сделать пол тёплым во всей квартире'
    }));
    scriptsSection.appendChild(eventGrid);
    main.appendChild(scriptsSection);

    const devicesSection = createElement('section', 'section main__devices');
    const devicesTitle = createElement('div', 'section__title');
    devicesTitle.appendChild(createElement('h2', 'section__title-header', null, ['Избранные устройства']));
    const select = createElement('select', 'section__select', { defaultValue: 'all', onInput: onSelectTab }, []);
    TABS_KEYS.forEach(key => {
        select.appendChild(createElement('option', null, { value: key }, [TABS[key].title]));
    });
    devicesTitle.appendChild(select);

    const tabs = createElement('ul', 'section__tabs');
    TABS_KEYS.forEach(key => {
        tabs.appendChild(createElement('li', 'section__tab', { role: 'tab', 'aria-selected': 'false', tabIndex: '-1', id: `tab_${key}`, 'aria-controls': `panel_${key}`, onClick: () => setActiveTab(key) }, [TABS[key].title]));
    });
    devicesTitle.appendChild(tabs);

    const panelWrapper = createElement('div', 'section__panel-wrapper');
    const panels = {};
    TABS_KEYS.forEach(key => {
        const panel = createElement('div', `section__panel section__panel_hidden`, { role: 'tabpanel', 'aria-hidden': 'true', id: `panel_${key}`, 'aria-labelledby': `tab_${key}` }, [
            createElement('ul', 'section__panel-list')
        ]);
        panels[key] = panel;
        panelWrapper.appendChild(panel);
    });

    devicesSection.appendChild(devicesTitle);
    devicesSection.appendChild(panelWrapper);

    main.appendChild(devicesSection);

    app.appendChild(main);

    const activeTab = new URLSearchParams(location.search).get('tab') || 'all';
    setActiveTab(activeTab);

    function createEvent(props) {
        const eventItem = createElement('li', `event ${props.slim ? 'event_slim' : ''}`);
        const button = createElement('button', 'event__button');
        button.appendChild(createElement('span', `event__icon event__icon_${props.icon}`, { role: 'img', 'aria-label': props.iconLabel }));
        button.appendChild(createElement('h4', 'event__title', null, [props.title]));
        if (props.subtitle) {
            button.appendChild(createElement('span', 'event__subtitle', null, [props.subtitle]));
        }
        eventItem.appendChild(button);
        return eventItem;
    }

    function createSlimEvent(props) {
        return createEvent({ ...props, slim: true });
    }

    function setActiveTab(tab) {
        tabs.querySelectorAll('.section__tab').forEach(tabItem => tabItem.classList.remove('section__tab_active'));
        tabs.querySelector(`[aria-selected="true"]`).classList.remove('section__tab_active');
        tabs.querySelector(`#tab_${tab}`).classList.add('section__tab_active');
        tabs.querySelector(`#tab_${tab}`).setAttribute('aria-selected', 'true');
        tabs.querySelector(`#tab_${tab}`).tabIndex = '0';

        Object.values(panels).forEach(panel => {
            panel.classList.add('section__panel_hidden');
            panel.setAttribute('aria-hidden', 'true');
        });

        const activePanel = panels[tab];
        activePanel.classList.remove('section__panel_hidden');
        activePanel.setAttribute('aria-hidden', 'false');

        const panelList = activePanel.querySelector('.section__panel-list');
        panelList.innerHTML = '';
        TABS[tab].items.forEach(item => {
            panelList.appendChild(createEvent(item));
        });
    }

    function onSelectTab(event) {
        setActiveTab(event.target.value);
    }

    function toggleMenu() {
        expanded = !expanded;
        toggled = true;
        menuButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        menuButton.querySelector('.header__menu-text').textContent = expanded ? 'Закрыть меню' : 'Открыть меню';
        links.classList.toggle('header__links_opened', expanded);
        links.classList.toggle('header__links_toggled', toggled);
    }
}

renderApp();