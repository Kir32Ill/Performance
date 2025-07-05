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

    TABS.all.items = Array(64).fill().flatMap(() => TABS.all.items.slice(0, 8));

    const TABS_KEYS = Object.keys(TABS);

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
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
        let expanded = false;
        let toggled = false;
        
        const header = document.createElement('header');
        header.className = 'header';
        
        const logo = document.createElement('a');
        logo.href = '/';
        logo.className = 'header__logo';
        logo.setAttribute('aria-label', 'Яндекс.Дом');
        
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
        
        const linksFragment = document.createDocumentFragment();
        linksData.forEach(linkData => {
            const item = document.createElement('li');
            item.className = 'header__item';
            
            const link = document.createElement('a');
            link.className = linkData.current ? 'header__link header__link_current' : 'header__link';
            link.href = linkData.href;
            if (linkData.current) link.setAttribute('aria-current', 'page');
            link.textContent = linkData.text;
            
            item.appendChild(link);
            linksFragment.appendChild(item);
        });
        
        links.appendChild(linksFragment);
        
        menuButton.addEventListener('click', () => {
            if (!toggled) toggled = true;
            expanded = !expanded;
            
            menuButton.setAttribute('aria-expanded', expanded.toString());
            menuText.textContent = expanded ? 'Закрыть меню' : 'Открыть меню';
            
            links.className = `header__links${expanded ? ' header__links_opened' : ''}${toggled ? ' header__links-toggled' : ''}`;
        });
        
        header.appendChild(logo);
        header.appendChild(menuButton);
        header.appendChild(links);
        
        return header;
    }

    function Main() {
        const main = document.createElement('main');
        main.className = 'main';
        const generalSection = document.createElement('section');
        generalSection.className = 'section main__general';
        
        const generalTitle = document.createElement('h2');
        generalTitle.className = 'section__title section__title-header section__main-title';
        generalTitle.textContent = 'Главное';
        
        const heroDashboard = document.createElement('div');
        heroDashboard.className = 'hero-dashboard';
        
        const primaryDiv = document.createElement('div');
        primaryDiv.className = 'hero-dashboard__primary';
        
        const dashboardTitle = document.createElement('h3');
        dashboardTitle.className = 'hero-dashboard__title';
        dashboardTitle.textContent = 'Привет, Геннадий!';
        
        const dashboardSubtitle = document.createElement('p');
        dashboardSubtitle.className = 'hero-dashboard__subtitle';
        dashboardSubtitle.textContent = 'Двери и окна закрыты, сигнализация включена.';
        
        const infoList = document.createElement('ul');
        infoList.className = 'hero-dashboard__info';
        
        const homeItem = document.createElement('li');
        homeItem.className = 'hero-dashboard__item';
        
        const homeTitle = document.createElement('div');
        homeTitle.className = 'hero-dashboard__item-title';
        homeTitle.textContent = 'Дома';
        
        const homeDetails = document.createElement('div');
        homeDetails.className = 'hero-dashboard__item-details';
        homeDetails.textContent = '+23';
        
        const homeDegrees = document.createElement('span');
        homeDegrees.className = 'a11y-hidden';
        homeDegrees.textContent = '°';
        
        homeDetails.appendChild(homeDegrees);
        homeItem.appendChild(homeTitle);
        homeItem.appendChild(homeDetails);
        
        const outsideItem = document.createElement('li');
        outsideItem.className = 'hero-dashboard__item';
        
        const outsideTitle = document.createElement('div');
        outsideTitle.className = 'hero-dashboard__item-title';
        outsideTitle.textContent = 'За окном';
        
        const outsideDetails = document.createElement('div');
        outsideDetails.className = 'hero-dashboard__item-details';
        outsideDetails.textContent = '+19';
        
        const outsideDegrees = document.createElement('span');
        outsideDegrees.className = 'a11y-hidden';
        outsideDegrees.textContent = '°';
        
        const rainIcon = document.createElement('div');
        rainIcon.className = 'hero-dashboard__icon hero-dashboard__icon_rain';
        rainIcon.setAttribute('role', 'img');
        rainIcon.setAttribute('aria-label', 'Дождь');
        
        outsideDetails.appendChild(outsideDegrees);
        outsideDetails.appendChild(rainIcon);
        outsideItem.appendChild(outsideTitle);
        outsideItem.appendChild(outsideDetails);
        
        infoList.appendChild(homeItem);
        infoList.appendChild(outsideItem);
        
        primaryDiv.appendChild(dashboardTitle);
        primaryDiv.appendChild(dashboardSubtitle);
        primaryDiv.appendChild(infoList);
        
        const scheduleList = document.createElement('ul');
        scheduleList.className = 'hero-dashboard__schedule';
        
        const events = [
            { icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' }
        ];
        
        const eventsFragment = document.createDocumentFragment();
        events.forEach(event => {
            eventsFragment.appendChild(Event(event));
        });
        scheduleList.appendChild(eventsFragment);
        
        heroDashboard.appendChild(primaryDiv);
        heroDashboard.appendChild(scheduleList);
        
        generalSection.appendChild(generalTitle);
        generalSection.appendChild(heroDashboard);
        
        const scriptsSection = document.createElement('section');
        scriptsSection.className = 'section main__scripts';
        
        const scriptsTitle = document.createElement('h2');
        scriptsTitle.className = 'section__title section__title-header';
        scriptsTitle.textContent = 'Избранные сценарии';
        
        const eventGrid = document.createElement('ul');
        eventGrid.className = 'event-grid';
        
        const slimEvents = [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет в доме и во дворе', slim: true },
            { icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу', slim: true },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Набрать горячую ванну', subtitle: 'Начнётся в 18:00', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Сделать пол тёплым во всей квартире', slim: true }
        ];
        
        const slimEventsFragment = document.createDocumentFragment();
        slimEvents.forEach(event => {
            slimEventsFragment.appendChild(Event(event));
        });
        eventGrid.appendChild(slimEventsFragment);
        
        scriptsSection.appendChild(scriptsTitle);
        scriptsSection.appendChild(eventGrid);
        
        const devicesSection = document.createElement('section');
        devicesSection.className = 'section main__devices';
        
        const devicesTitleDiv = document.createElement('div');
        devicesTitleDiv.className = 'section__title';
        
        const devicesTitle = document.createElement('h2');
        devicesTitle.className = 'section__title-header';
        devicesTitle.textContent = 'Избранные устройства';
        
        const select = document.createElement('select');
        select.className = 'section__select';
        select.value = 'all';
        
        const selectFragment = document.createDocumentFragment();
        TABS_KEYS.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = TABS[key].title;
            selectFragment.appendChild(option);
        });
        select.appendChild(selectFragment);
        
        const tabsList = document.createElement('ul');
        tabsList.setAttribute('role', 'tablist');
        tabsList.className = 'section__tabs';
        
        let activeTab = new URLSearchParams(window.location.search).get('tab') || 'all';
        let hasRightScroll = false;
        
        const tabsFragment = document.createDocumentFragment();
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
            
            tabsFragment.appendChild(tab);
        });
        tabsList.appendChild(tabsFragment);
        
        const panelWrapper = document.createElement('div');
        panelWrapper.className = 'section__panel-wrapper';
        
        function updateTabs() {
            tabsList.querySelectorAll('li').forEach(tab => {
                const key = tab.id.replace('tab_', '');
                const isActive = key === activeTab;
                
                tab.setAttribute('aria-selected', isActive.toString());
                tab.className = `section__tab${isActive ? ' section__tab_active' : ''}`;
                if (isActive) tab.setAttribute('tabIndex', '0');
                else tab.removeAttribute('tabIndex');
            });
            
            select.value = activeTab;
        }
        
        const updatePanels = debounce(function() {
            const activePanel = panelWrapper.querySelector(`#panel_${activeTab}`);
            if (!activePanel) return;

            const items = activePanel.querySelectorAll('.event');
            const sumWidth = Array.from(items).reduce((acc, item) => acc + item.offsetWidth, 0);
            const newHasRightScroll = sumWidth > panelWrapper.offsetWidth;

            if (newHasRightScroll !== hasRightScroll) {
                hasRightScroll = newHasRightScroll;
                const arrow = panelWrapper.querySelector('.section__arrow');
                
                if (hasRightScroll && !arrow) {
                    const arrow = document.createElement('div');
                    arrow.className = 'section__arrow';
                    arrow.addEventListener('click', () => {
                        activePanel.scrollBy({
                            left: 400,
                            behavior: 'smooth'
                        });
                    });
                    panelWrapper.appendChild(arrow);
                } else if (!hasRightScroll && arrow) {
                    panelWrapper.removeChild(arrow);
                }
            }
        }, 100);
        
        select.addEventListener('change', (e) => {
            activeTab = e.target.value;
            updateTabs();
            updatePanels();
        });
        
        const panelsFragment = document.createDocumentFragment();
        TABS_KEYS.forEach(key => {
            const panel = document.createElement('div');
            panel.setAttribute('role', 'tabpanel');
            panel.className = `section__panel${key === activeTab ? '' : ' section__panel_hidden'}`;
            panel.setAttribute('aria-hidden', key !== activeTab ? 'true' : 'false');
            panel.id = `panel_${key}`;
            panel.setAttribute('aria-labelledby', `tab_${key}`);
            
            const panelList = document.createElement('ul');
            panelList.className = 'section__panel-list';
            
            const itemsFragment = document.createDocumentFragment();
            TABS[key].items.forEach(item => {
                itemsFragment.appendChild(Event(item));
            });
            
            panelList.appendChild(itemsFragment);
            panel.appendChild(panelList);
            panelsFragment.appendChild(panel);
        });
        panelWrapper.appendChild(panelsFragment);
        
        devicesTitleDiv.appendChild(devicesTitle);
        devicesTitleDiv.appendChild(select);
        devicesTitleDiv.appendChild(tabsList);
        
        devicesSection.appendChild(devicesTitleDiv);
        devicesSection.appendChild(panelWrapper);
        
        main.appendChild(generalSection);
        main.appendChild(scriptsSection);
        main.appendChild(devicesSection);
        
        updatePanels();
        
        window.addEventListener('resize', debounce(updatePanels, 100));
        
        return main;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const appFragment = document.createDocumentFragment();
        appFragment.appendChild(Header());
        appFragment.appendChild(Main());
        
        requestAnimationFrame(() => {
            app.appendChild(appFragment);
        });
    });
})();