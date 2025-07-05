(function() {
    "use strict";
    const app = document.getElementById('app');
    if (!app) return;

    const fragment = document.createDocumentFragment();
    const TABS = {
        all: {
            title: 'Все',
            items: [
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
                { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
                { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' },
                { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
                { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' },
                { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' },
                { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' }
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
    function createElement(tag, attrs = {}, ...children) {
        const element = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        const childFragment = document.createDocumentFragment();
        children.forEach(child => {
            if (typeof child === 'string') {
                childFragment.appendChild(document.createTextNode(child));
            } else if (Array.isArray(child)) {
                child.forEach(nestedChild => childFragment.appendChild(nestedChild));
            } else if (child) {
                childFragment.appendChild(child);
            }
        });
        element.appendChild(childFragment);
        
        return element;
    }

    function Event(props) {
        const li = document.createElement('li');
        li.className = props.slim ? 'event event_slim' : 'event';
        
        const button = document.createElement('button');
        button.className = 'event__button';
        
        const icon = document.createElement('span');
        icon.className = `event__icon event__icon_${props.icon}`;
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', props.iconLabel);
        
        const title = document.createElement('h4');
        title.className = 'event__title';
        title.textContent = props.title;
        
        button.appendChild(icon);
        button.appendChild(title);
        
        if (props.subtitle) {
            const subtitle = document.createElement('span');
            subtitle.className = 'event__subtitle';
            subtitle.textContent = props.subtitle;
            button.appendChild(subtitle);
        }
        
        li.appendChild(button);
    
        if (props.onSize) {
            requestAnimationFrame(() => {
                const width = li.offsetWidth;
                const height = li.offsetHeight;
                props.onSize({ width, height });
            });
        }
        
        return li;
    }

    function Header() {
        const header = document.createElement('header');
        header.className = 'header';
        
        const logo = createElement('a', {
            href: '/',
            className: 'header__logo',
            'aria-label': 'Яндекс.Дом'
        });
        
        const menuButton = createElement('button', {
            className: 'header__menu',
            'aria-expanded': 'false',
            onClick: toggleMenu
        }, createElement('span', {
            className: 'header__menu-text a11y-hidden',
            textContent: 'Открыть меню'
        }));
        
        const links = createElement('ul', { className: 'header__links' });
        
        [
            { text: 'Сводка', href: '/', current: true },
            { text: 'Устройства', href: '/devices' },
            { text: 'Сценарии', href: '/scripts' }
        ].forEach(linkData => {
            const link = createElement('a', {
                className: linkData.current ? 'header__link header__link_current' : 'header__link',
                href: linkData.href,
                ...(linkData.current && { 'aria-current': 'page' }),
                textContent: linkData.text
            });
            
            links.appendChild(createElement('li', { className: 'header__item' }, link));
        });
        
        header.appendChild(logo);
        header.appendChild(menuButton);
        header.appendChild(links);
        
        let expanded = false;
        let toggled = false;
        
        function toggleMenu() {
            if (!toggled) toggled = true;
            expanded = !expanded;
            
            menuButton.setAttribute('aria-expanded', expanded);
            menuButton.firstChild.textContent = expanded ? 'Закрыть меню' : 'Открыть меню';
            
            links.className = `header__links${expanded ? ' header__links_opened' : ''}${toggled ? ' header__links-toggled' : ''}`;
        }
        
        return header;
    }

    function Main() {
        const main = document.createElement('main');
        main.className = 'main';
        const generalSection = createElement('section', { className: 'section main__general' },
            createElement('h2', { className: 'section__title section__title-header section__main-title' }, 'Главное'),
            createHeroDashboard()
        );
        const scriptsSection = createElement('section', { className: 'section main__scripts' },
            createElement('h2', { className: 'section__title section__title-header' }, 'Избранные сценарии'),
            createEventGrid()
        );
        const devicesSection = createDevicesSection();
        
        main.appendChild(generalSection);
        main.appendChild(scriptsSection);
        main.appendChild(devicesSection);
        
        return main;
    }

    function createHeroDashboard() {
        const heroDashboard = document.createElement('div');
        heroDashboard.className = 'hero-dashboard';
        const primaryDiv = document.createElement('div');
        primaryDiv.className = 'hero-dashboard__primary';
        
        const dashboardTitle = createElement('h3', { className: 'hero-dashboard__title' }, 'Привет, Геннадий!');
        const dashboardSubtitle = createElement('p', { className: 'hero-dashboard__subtitle' }, 'Двери и окна закрыты, сигнализация включена.');
        
        const infoList = createElement('ul', { className: 'hero-dashboard__info' });

        const homeItem = createElement('li', { className: 'hero-dashboard__item' },
            createElement('div', { className: 'hero-dashboard__item-title' }, 'Дома'),
            createElement('div', { className: 'hero-dashboard__item-details' }, 
                '+23',
                createElement('span', { className: 'a11y-hidden' }, '°')
            )
        );

        const outsideItem = createElement('li', { className: 'hero-dashboard__item' },
            createElement('div', { className: 'hero-dashboard__item-title' }, 'За окном'),
            createElement('div', { className: 'hero-dashboard__item-details' }, 
                '+19',
                createElement('span', { className: 'a11y-hidden' }, '°'),
                createElement('div', { 
                    className: 'hero-dashboard__icon hero-dashboard__icon_rain',
                    role: 'img',
                    'aria-label': 'Дождь'
                })
            )
        );
        
        infoList.appendChild(homeItem);
        infoList.appendChild(outsideItem);
        
        primaryDiv.appendChild(dashboardTitle);
        primaryDiv.appendChild(dashboardSubtitle);
        primaryDiv.appendChild(infoList);

        const scheduleList = createElement('ul', { className: 'hero-dashboard__schedule' });
        
        [
            { icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' }
        ].forEach(item => {
            scheduleList.appendChild(Event(item));
        });
        
        heroDashboard.appendChild(primaryDiv);
        heroDashboard.appendChild(scheduleList);
        
        return heroDashboard;
    }

    function createEventGrid() {
        const eventGrid = document.createElement('ul');
        eventGrid.className = 'event-grid';
        
        [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет в доме и во дворе', slim: true },
            { icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу', slim: true },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Набрать горячую ванну', subtitle: 'Начнётся в 18:00', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Сделать пол тёплым во всей квартире', slim: true }
        ].forEach(item => {
            eventGrid.appendChild(Event(item));
        });
        
        return eventGrid;
    }

    function createDevicesSection() {
        const devicesSection = document.createElement('section');
        devicesSection.className = 'section main__devices';
        
        const devicesTitleDiv = document.createElement('div');
        devicesTitleDiv.className = 'section__title';
        
        const devicesTitle = createElement('h2', { className: 'section__title-header' }, 'Избранные устройства');
        
        const select = createElement('select', { className: 'section__select' });
        TABS_KEYS.forEach(key => {
            select.appendChild(createElement('option', { value: key }, TABS[key].title));
        });
        
        const tabsList = createElement('ul', { 
            className: 'section__tabs',
            role: 'tablist'
        });
        
        let activeTab = new URLSearchParams(window.location.search).get('tab') || 'all';
        
        TABS_KEYS.forEach(key => {
            const tab = createElement('li', {
                role: 'tab',
                'aria-selected': key === activeTab ? 'true' : 'false',
                ...(key === activeTab && { tabIndex: '0' }),
                className: `section__tab${key === activeTab ? ' section__tab_active' : ''}`,
                id: `tab_${key}`,
                'aria-controls': `panel_${key}`,
                textContent: TABS[key].title,
                onClick: () => {
                    activeTab = key;
                    updateTabs();
                    updatePanels();
                }
            });
            
            tabsList.appendChild(tab);
        });
        
        const panelWrapper = document.createElement('div');
        panelWrapper.className = 'section__panel-wrapper';
        
        let hasRightScroll = false;
        const sizes = [];
        
        function updateTabs() {
            tabsList.querySelectorAll('li').forEach(tab => {
                const key = tab.id.replace('tab_', '');
                const isActive = key === activeTab;
                
                tab.setAttribute('aria-selected', isActive);
                tab.className = `section__tab${isActive ? ' section__tab_active' : ''}`;
                if (isActive) tab.setAttribute('tabIndex', '0');
                else tab.removeAttribute('tabIndex');
            });
            
            select.value = activeTab;
        }
        
        function updatePanels() {
            panelWrapper.querySelectorAll('.section__panel').forEach(panel => {
                const key = panel.id.replace('panel_', '');
                const isActive = key === activeTab;
                
                panel.setAttribute('aria-hidden', !isActive);
                panel.className = `section__panel${!isActive ? ' section__panel_hidden' : ''}`;
                
                if (isActive) {
                    sizes.length = 0;
                    const items = panel.querySelectorAll('.event');
                    items.forEach(item => {
                        sizes.push({ 
                            width: item.offsetWidth, 
                            height: item.offsetHeight 
                        });
                    });
                    
                    const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
                    const newHasRightScroll = sumWidth > panelWrapper.offsetWidth;
                    
                    if (newHasRightScroll !== hasRightScroll) {
                        hasRightScroll = newHasRightScroll;
                        const arrow = panelWrapper.querySelector('.section__arrow');
                        
                        if (hasRightScroll && !arrow) {
                            const newArrow = createElement('div', {
                                className: 'section__arrow',
                                onClick: () => {
                                    const scroller = panelWrapper.querySelector('.section__panel:not(.section__panel_hidden)');
                                    if (scroller) {
                                        scroller.scrollTo({
                                            left: scroller.scrollLeft + 400,
                                            behavior: 'smooth'
                                        });
                                    }
                                }
                            });
                            panelWrapper.appendChild(newArrow);
                        } else if (!hasRightScroll && arrow) {
                            panelWrapper.removeChild(arrow);
                        }
                    }
                }
            });
        }
        
        select.addEventListener('change', (e) => {
            activeTab = e.target.value;
            updateTabs();
            updatePanels();
        });
        
        TABS_KEYS.forEach(key => {
            const panel = createElement('div', {
                className: `section__panel${key === activeTab ? '' : ' section__panel_hidden'}`,
                id: `panel_${key}`,
                'aria-labelledby': `tab_${key}`,
                'aria-hidden': key !== activeTab,
                role: 'tabpanel'
            });
            
            const panelList = createElement('ul', { className: 'section__panel-list' });
            
            TABS[key].items.forEach((item, index) => {
                panelList.appendChild(Event({
                    ...item,
                    onSize: key === activeTab ? (size) => {
                        sizes.push(size);
                        const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
                        const newHasRightScroll = sumWidth > panelWrapper.offsetWidth;
                        
                        if (newHasRightScroll !== hasRightScroll) {
                            hasRightScroll = newHasRightScroll;
                            const arrow = panelWrapper.querySelector('.section__arrow');
                            
                            if (hasRightScroll && !arrow) {
                                panelWrapper.appendChild(createElement('div', {
                                    className: 'section__arrow',
                                    onClick: () => {
                                        const scroller = panelWrapper.querySelector('.section__panel:not(.section__panel_hidden)');
                                        if (scroller) {
                                            scroller.scrollTo({
                                                left: scroller.scrollLeft + 400,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }
                                }));
                            } else if (!hasRightScroll && arrow) {
                                panelWrapper.removeChild(arrow);
                            }
                        }
                    } : undefined
                }));
            });
            
            panel.appendChild(panelList);
            panelWrapper.appendChild(panel);
        });
        
        devicesTitleDiv.appendChild(devicesTitle);
        devicesTitleDiv.appendChild(select);
        devicesTitleDiv.appendChild(tabsList);
        
        devicesSection.appendChild(devicesTitleDiv);
        devicesSection.appendChild(panelWrapper);
        
        updatePanels();
        
        return devicesSection;
    }
    document.addEventListener('DOMContentLoaded', () => {
        fragment.appendChild(Header());
        fragment.appendChild(Main());
        app.appendChild(fragment);
    });
})();