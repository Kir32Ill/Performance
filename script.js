(function() {
    "use strict";
    const initSkeleton = () => {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <header class="header">
                <a href="/" class="header__logo" aria-label="Яндекс.Дом"></a>
                <button class="header__menu" aria-expanded="false">
                    <span class="header__menu-text a11y-hidden">Меню</span>
                </button>
                <ul class="header__links">
                    <li class="header__item"><a href="/" class="header__link header__link_current" aria-current="page">Сводка</a></li>
                    <li class="header__item"><a href="/devices" class="header__link">Устройства</a></li>
                    <li class="header__item"><a href="/scripts" class="header__link">Сценарии</a></li>
                </ul>
            </header>
            <main class="main">
                <section class="section main__general">
                    <h2 class="section__title section__title-header section__main-title">Главное</h2>
                    <div class="hero-dashboard">
                        <div class="hero-dashboard__primary">
                            <h3 class="hero-dashboard__title">Привет, Геннадий!</h3>
                            <p class="hero-dashboard__subtitle">Двери и окна закрыты, сигнализация включена.</p>
                            <ul class="hero-dashboard__info">
                                <li class="hero-dashboard__item">
                                    <div class="hero-dashboard__item-title">Дома</div>
                                    <div class="hero-dashboard__item-details">+23<span class="a11y-hidden">°</span></div>
                                </li>
                                <li class="hero-dashboard__item">
                                    <div class="hero-dashboard__item-title">За окном</div>
                                    <div class="hero-dashboard__item-details">+19<span class="a11y-hidden">°</span><div class="hero-dashboard__icon hero-dashboard__icon_rain" role="img" aria-label="Дождь"></div></div>
                                </li>
                            </ul>
                        </div>
                        <ul class="hero-dashboard__schedule"></ul>
                    </div>
                </section>
                <section class="section main__scripts">
                    <h2 class="section__title section__title-header">Избранные сценарии</h2>
                    <ul class="event-grid"></ul>
                </section>
                <section class="section main__devices">
                    <div class="section__title">
                        <h2 class="section__title-header">Избранные устройства</h2>
                        <select class="section__select"></select>
                        <ul class="section__tabs" role="tablist"></ul>
                    </div>
                    <div class="section__panel-wrapper"></div>
                </section>
            </main>
            <footer class="footer">
                <ul class="footer__list">
                    <li class="footer__item"><a class="footer__link" href="/">Помощь</a></li>
                    <li class="footer__item"><a class="footer__link" href="/">Обратная связь</a></li>
                    <li class="footer__item"><a class="footer__link" href="/">Разработчикам</a></li>
                    <li class="footer__item"><a class="footer__link" href="/">Условия использования</a></li>
                </ul>
                <div class="footer__copyright">© 1997–2023 ООО «Яндекс»</div>
            </footer>
        `;
    };

    const createEvent = (props) => {
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
        return li;
    };

    const loadData = () => {
        const baseItems = [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включено' },
            { icon: 'light', iconLabel: 'Освещение', title: 'D-Link Omna 180 Cam', subtitle: 'Включится в 17:00' },
            { icon: 'temp', iconLabel: 'Температура', title: 'Elgato Eve Degree Connected', subtitle: 'Выключено до 17:00' },
            { icon: 'light', iconLabel: 'Освещение', title: 'LIFX Mini Day & Dusk A60 E27', subtitle: 'Включится в 17:00' },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Xiaomi Mi Air Purifier 2S', subtitle: 'Включено' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Philips Zhirui', subtitle: 'Включено' }
        ];

        const allItems = Array(64).fill().flatMap(() => baseItems.slice());

        return {
            all: { title: 'Все', items: allItems },
            kitchen: {
                title: 'Кухня',
                items: baseItems.slice(0, 2)
            },
            hall: {
                title: 'Зал',
                items: baseItems.slice(2, 4)
            },
            lights: {
                title: 'Лампочки',
                items: baseItems.slice(1, 5)
            },
            cameras: {
                title: 'Камеры',
                items: baseItems.slice(0, 1)
            }
        };
    };
    const initApp = () => {
        const menuButton = document.querySelector('.header__menu');
        const links = document.querySelector('.header__links');
        let menuExpanded = false;

        menuButton.addEventListener('click', () => {
            menuExpanded = !menuExpanded;
            menuButton.setAttribute('aria-expanded', menuExpanded);
            links.classList.toggle('header__links_opened', menuExpanded);
        });

        const TABS = loadData();
        const TABS_KEYS = Object.keys(TABS);

        const select = document.querySelector('.section__select');
        const tabsList = document.querySelector('.section__tabs');
        const panelWrapper = document.querySelector('.section__panel-wrapper');
        let activeTab = 'all';
        let hasRightScroll = false;

        TABS_KEYS.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = TABS[key].title;
            select.appendChild(option);

            const tab = document.createElement('li');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', key === activeTab);
            tab.className = `section__tab${key === activeTab ? ' section__tab_active' : ''}`;
            tab.textContent = TABS[key].title;
            
            tab.addEventListener('click', () => {
                activeTab = key;
                updateTabs();
                updatePanel();
            });
            
            tabsList.appendChild(tab);
        });

        const initPanel = () => {
            const panel = document.createElement('div');
            panel.className = 'section__panel';
            panel.setAttribute('role', 'tabpanel');
            
            const panelList = document.createElement('ul');
            panelList.className = 'section__panel-list';
            
            const itemsToRender = TABS[activeTab].items.slice(0, 20);
            itemsToRender.forEach(item => {
                panelList.appendChild(createEvent(item));
            });
            
            panel.appendChild(panelList);
            panelWrapper.innerHTML = '';
            panelWrapper.appendChild(panel);
            
            checkScrollArrow();
        };

        const checkScrollArrow = () => {
            const panel = panelWrapper.querySelector('.section__panel');
            if (!panel) return;
            
            const needsArrow = panel.scrollWidth > panelWrapper.offsetWidth;
            
            if (needsArrow && !hasRightScroll) {
                const arrow = document.createElement('div');
                arrow.className = 'section__arrow';
                arrow.addEventListener('click', () => {
                    panel.scrollBy({ left: 300, behavior: 'smooth' });
                });
                panelWrapper.appendChild(arrow);
                hasRightScroll = true;
            } else if (!needsArrow && hasRightScroll) {
                const arrow = panelWrapper.querySelector('.section__arrow');
                if (arrow) panelWrapper.removeChild(arrow);
                hasRightScroll = false;
            }
        };

        const updateTabs = () => {
            document.querySelectorAll('.section__tab').forEach(tab => {
                const isActive = tab.textContent === TABS[activeTab].title;
                tab.className = `section__tab${isActive ? ' section__tab_active' : ''}`;
                tab.setAttribute('aria-selected', isActive);
            });
            select.value = activeTab;
        };

        const updatePanel = () => {
            initPanel();
        };

        const scheduleItems = [
            { icon: 'temp', iconLabel: 'Температура', title: 'Philips Cooler', subtitle: 'Начнет охлаждать в 16:30' },
            { icon: 'light', iconLabel: 'Освещение', title: 'Xiaomi Yeelight LED Smart Bulb', subtitle: 'Включится в 17:00' }
        ];

        const scheduleList = document.querySelector('.hero-dashboard__schedule');
        scheduleItems.forEach(item => {
            scheduleList.appendChild(createEvent(item));
        });

        const scenarioItems = [
            { icon: 'light2', iconLabel: 'Освещение', title: 'Выключить весь свет', slim: true },
            { icon: 'schedule', iconLabel: 'Расписание', title: 'Я ухожу', slim: true },
            { icon: 'light2', iconLabel: 'Освещение', title: 'Включить свет в коридоре', slim: true },
            { icon: 'temp2', iconLabel: 'Температура', title: 'Набрать ванну', subtitle: 'Начнётся в 18:00', slim: true }
        ];

        const eventGrid = document.querySelector('.event-grid');
        scenarioItems.forEach(item => {
            eventGrid.appendChild(createEvent(item));
        });

        initPanel();
    };

    if (document.readyState === 'complete') {
        initSkeleton();
        requestAnimationFrame(() => {
            initApp();
        });
    } else {
        initSkeleton();
        document.addEventListener('DOMContentLoaded', () => {
            requestAnimationFrame(() => {
                initApp();
            });
        });
    }

    const preloadResources = () => {
        const preloadFont = document.createElement('link');
        preloadFont.rel = 'preload';
        preloadFont.href = 'assets/lato.woff2';
        preloadFont.as = 'font';
        preloadFont.type = 'font/woff2';
        preloadFont.crossOrigin = 'anonymous';
        document.head.appendChild(preloadFont);
    };

    preloadResources();
})();