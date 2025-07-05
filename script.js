(function() {
    "use strict";
    const app = document.getElementById('app');
    if (!app) return;
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

    for (let i = 0; i < 6; i++) {
        TABS.all.items = [...TABS.all.items, ...TABS.all.items];
    }

    const TABS_KEYS = Object.keys(TABS);
    function createElement(tag, attrs, ...children) {
        const element = document.createElement(tag);
        
        if (attrs) {
            for (const [key, value] of Object.entries(attrs)) {
                if (key === 'className') {
                    element.className = value;
                } else if (key.startsWith('on')) {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else {
                    element.setAttribute(key, value);
                }
            }
        }
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (Array.isArray(child)) {
                child.forEach(nestedChild => element.appendChild(nestedChild));
            } else if (child) {
                element.appendChild(child);
            }
        });
        
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
            setTimeout(() => {
                const width = li.offsetWidth;
                const height = li.offsetHeight;
                props.onSize({ width, height });
            }, 0);
        }
        
        return li;
    }

    function Header() {
        let expanded = false;
        let toggled = false;
        
        const header = document.createElement('header');
        header.className = 'header';
    
        const logo = document.createElement('a');
        logo.href = '/';
        logo.className = 'header__logo';
        logo.setAttribute('aria-label', 'Яндекс.Дом');
        header.appendChild(logo);
        
        const menuButton = document.createElement('button');
        menuButton.className = 'header__menu';
        menuButton.setAttribute('aria-expanded', 'false');
        
        const menuText = document.createElement('span');
        menuText.className = 'header__menu-text a11y-hidden';
        menuText.textContent = 'Открыть меню';
        menuButton.appendChild(menuText);
        
        const links = document.createElement('ul');
        links.className = 'header__links';
        
        const linksData = [
            { text: 'Сводка', href: '/', current: true },
            { text: 'Устройства', href: '/devices' },
            { text: 'Сценарии', href: '/scripts' }
        ];
        
        linksData.forEach(linkData => {
            const item = document.createElement('li');
            item.className = 'header__item';
            
            const link = document.createElement('a');
            link.className = linkData.current ? 'header__link header__link_current' : 'header__link';
            link.href = linkData.href;
            if (linkData.current) link.setAttribute('aria-current', 'page');
            link.textContent = linkData.text;
            
            item.appendChild(link);
            links.appendChild(item);
        });
        
        menuButton.addEventListener('click', () => {
            if (!toggled) toggled = true;
            expanded = !expanded;
            
            menuButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            menuText.textContent = expanded ? 'Закрыть меню' : 'Открыть меню';
            
            links.className = `header__links${expanded ? ' header__links_opened' : ''}${toggled ? ' header__links-toggled' : ''}`;
        });
        
        header.appendChild(menuButton);
        header.appendChild(links);
        
        return header;
    }
    function Main() {
        const main = document.createElement('main');
        main.className = 'main';
        
        const generalSection = createGeneralSection();
        main.appendChild(generalSection);
        
        const scriptsSection = createScriptsSection();
        main.appendChild(scriptsSection);
        
        const devicesSection = createDevicesSection();
        main.appendChild(devicesSection);
        
        return main;
    }

    function createGeneralSection() {
        const section = document.createElement('section');
        section.className = 'section main__general';
        
        const title = document.createElement('h2');
        title.className = 'section__title section__title-header section__main-title';
        title.textContent = 'Главное';
        section.appendChild(title);
        
        const dashboard = document.createElement('div');
        dashboard.className = 'hero-dashboard';
        
        const primary = document.createElement('div');
        primary.className = 'hero-dashboard__primary';
        
        const dashboardTitle = document.createElement('h3');
        dashboardTitle.className = 'hero-dashboard__title';
        dashboardTitle.textContent = 'Привет, Геннадий!';
        primary.appendChild(dashboardTitle);
        
        const dashboardSubtitle = document.createElement('p');
        dashboardSubtitle.className = 'hero-dashboard__subtitle';
        dashboardSubtitle.textContent = 'Двери и окна закрыты, сигализация включена.';
        primary.appendChild(dashboardSubtitle);
        
        const infoList = document.createElement('ul');
        infoList.className = 'hero-dashboard__info';
    
        const homeItem = document.createElement('li');
        homeItem.className = 'hero-dashboard__item';
        
        const homeTitle = document.createElement('div');
        homeTitle.className = 'hero-dashboard__item-title';
        homeTitle.textContent = 'Дома';
        homeItem.appendChild(homeTitle);
        
        const homeDetails = document.createElement('div');
        homeDetails.className = 'hero-dashboard__item-details';
        homeDetails.textContent = '+23';
        
        const homeDegrees = document.createElement('span');
        homeDegrees.className = 'a11y-hidden';
        homeDegrees.textContent = '°';
        homeDetails.appendChild(homeDegrees);
        
        homeItem.appendChild(homeDetails);
        infoList.appendChild(homeItem);
        
        const outsideItem = document.createElement('li');
        outsideItem.className = 'hero-dashboard__item';
        
        const outsideTitle = document.createElement('div');
        outsideTitle.className = 'hero-dashboard__item-title';
        outsideTitle.textContent = 'За окном';
        outsideItem.appendChild(outsideTitle);
        
        const outsideDetails = document.createElement('div');
        outsideDetails.className = 'hero-dashboard__item-details';
        outsideDetails.textContent = '+19';
        
        const outsideDegrees = document.createElement('span');
        outsideDegrees.className = 'a11y-hidden';
        outsideDegrees.textContent = '°';
        outsideDetails.appendChild(outsideDegrees);
        
        const rainIcon = document.createElement('div');
        rainIcon.className = 'hero-dashboard__icon hero-dashboard__icon_rain';
        rainIcon.setAttribute('role', 'img');
        rainIcon.setAttribute('aria-label', 'Дождь');
        outsideDetails.appendChild(rainIcon);
        
        outsideItem.appendChild(outsideDetails);
        infoList.appendChild(outsideItem);
        
        primary.appendChild(infoList);
        dashboard.appendChild(primary);
        
        const scheduleList = document.createElement('ul');
        scheduleList.className = 'hero-dashboard__schedule';
        
        const events = [
            { icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' }
        ];
        
        events.forEach(event => {
            scheduleList.appendChild(Event(event));
        });
        
        dashboard.appendChild(scheduleList);
        section.appendChild(dashboard);
        
        return section;
    }

    function createScriptsSection() {
        const section = document.createElement('section');
        section.className = 'section main__scripts';
        
        const title = document.createElement('h2');
        title.className = 'section__title section__title-header';
        title.textContent = 'Избранные сценарии';
        section.appendChild(title);
        
        const eventGrid = document.createElement('ul');
        eventGrid.className = 'event-grid';
        
        const slimEvents = [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет в доме и во дворе', slim: true },
            { icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу', slim: true },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Набрать горячую ванну', subtitle: 'Начнётся в 18:00', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Сделать пол тёплым во всей квартире', slim: true }
        ];
        
        slimEvents.forEach(event => {
            eventGrid.appendChild(Event(event));
        });
        
        section.appendChild(eventGrid);
        
        return section;
    }

    function createDevicesSection() {
        const section = document.createElement('section');
        section.className = 'section main__devices';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'section__title';
        
        const title = document.createElement('h2');
        title.className = 'section__title-header';
        title.textContent = 'Избранные устройства';
        titleDiv.appendChild(title);
        
        const select = document.createElement('select');
        select.className = 'section__select';
        select.value = 'all';
        
        TABS_KEYS.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = TABS[key].title;
            select.appendChild(option);
        });
        titleDiv.appendChild(select);
        
        const tabsList = document.createElement('ul');
        tabsList.setAttribute('role', 'tablist');
        tabsList.className = 'section__tabs';
        
        let activeTab = new URLSearchParams(window.location.search).get('tab') || 'all';
        
        TABS_KEYS.forEach(key => {
            const tab = document.createElement('li');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', key === activeTab ? 'true' : 'false');
            if (key === activeTab) tab.setAttribute('tabIndex', '0');
            tab.className = `section__tab${key === activeTab ? ' section__tab_active' : ''}`;
            tab.id = `tab_${key}`;
            tab.setAttribute('aria-controls', `panel_${key}`);
            tab.textContent = TABS[key].title;
            
            tab.addEventListener('click', () => {
                activeTab = key;
                updateTabs();
                updatePanels();
            });
            
            tabsList.appendChild(tab);
        });
        titleDiv.appendChild(tabsList);
        section.appendChild(titleDiv);
        
        const panelWrapper = document.createElement('div');
        panelWrapper.className = 'section__panel-wrapper';
        
        let hasRightScroll = false;
        const sizes = [];
        
        function updateTabs() {
            tabsList.querySelectorAll('li').forEach(tab => {
                const key = tab.id.replace('tab_', '');
                const isActive = key === activeTab;
                
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
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
                
                panel.setAttribute('aria-hidden', !isActive ? 'true' : 'false');
                panel.className = `section__panel${!isActive ? ' section__panel_hidden' : ''}`;
                
                if (isActive) {
                    sizes.length = 0;
                    const items = panel.querySelectorAll('.event');
                    items.forEach(item => {
                        const width = item.offsetWidth;
                        const height = item.offsetHeight;
                        sizes.push({ width, height });
                    });
                    
                    const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
                    const newHasRightScroll = sumWidth > panelWrapper.offsetWidth;
                    
                    if (newHasRightScroll !== hasRightScroll) {
                        hasRightScroll = newHasRightScroll;
                        if (hasRightScroll) {
                            const arrow = document.createElement('div');
                            arrow.className = 'section__arrow';
                            arrow.addEventListener('click', () => {
                                const scroller = panelWrapper.querySelector('.section__panel:not(.section__panel_hidden)');
                                if (scroller) {
                                    scroller.scrollTo({
                                        left: scroller.scrollLeft + 400,
                                        behavior: 'smooth'
                                    });
                                }
                            });
                            panelWrapper.appendChild(arrow);
                        } else {
                            const arrow = panelWrapper.querySelector('.section__arrow');
                            if (arrow) panelWrapper.removeChild(arrow);
                        }
                    }
                }
            });
        }
        
        select.addEventListener('input', (e) => {
            activeTab = e.target.value;
            updateTabs();
            updatePanels();
        });
        
        TABS_KEYS.forEach(key => {
            const panel = document.createElement('div');
            panel.setAttribute('role', 'tabpanel');
            panel.className = `section__panel${key === activeTab ? '' : ' section__panel_hidden'}`;
            panel.setAttribute('aria-hidden', key !== activeTab ? 'true' : 'false');
            panel.id = `panel_${key}`;
            panel.setAttribute('aria-labelledby', `tab_${key}`);
            
            const panelList = document.createElement('ul');
            panelList.className = 'section__panel-list';
            
            TABS[key].items.forEach((item, index) => {
                const event = Event({
                    ...item,
                    onSize: key === activeTab ? (size) => {
                        sizes.push(size);
                        const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
                        const newHasRightScroll = sumWidth > panelWrapper.offsetWidth;
                        
                        if (newHasRightScroll !== hasRightScroll) {
                            hasRightScroll = newHasRightScroll;
                            if (hasRightScroll) {
                                const arrow = document.createElement('div');
                                arrow.className = 'section__arrow';
                                arrow.addEventListener('click', () => {
                                    const scroller = panelWrapper.querySelector('.section__panel:not(.section__panel_hidden)');
                                    if (scroller) {
                                        scroller.scrollTo({
                                            left: scroller.scrollLeft + 400,
                                            behavior: 'smooth'
                                        });
                                    }
                                });
                                panelWrapper.appendChild(arrow);
                            } else {
                                const arrow = panelWrapper.querySelector('.section__arrow');
                                if (arrow) panelWrapper.removeChild(arrow);
                            }
                        }
                    } : undefined
                });
                panelList.appendChild(event);
            });
            
            panel.appendChild(panelList);
            panelWrapper.appendChild(panel);
        });
        
        section.appendChild(panelWrapper);
        
        updatePanels();
        
        return section;
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            app.appendChild(Header());
            app.appendChild(Main());
        }, 100);
    });
})();