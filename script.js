(function() {
    "use strict";

    const DeviceCard = React.memo(function DeviceCard({ device, reportSize }) {
        const cardRef = React.useRef();
        const prevSize = React.useRef({ width: 0, height: 0 });

        React.useLayoutEffect(() => {
            if (!cardRef.current || !reportSize) return;
            
            const width = cardRef.current.offsetWidth;
            const height = cardRef.current.offsetHeight;
            
            if (width !== prevSize.current.width || height !== prevSize.current.height) {
                prevSize.current = { width, height };
                reportSize(device.id, { width, height });
            }
        }, [device.id, reportSize]);

        return React.createElement("li", {
            ref: cardRef,
            className: device.compact ? "event event_slim" : "event"
        },
            React.createElement("button", { className: "event__button" }, [
                React.createElement("span", {
                    key: "icon",
                    className: `event__icon event__icon_${device.icon}`,
                    role: "img",
                    "aria-label": device.iconLabel || ""
                }),
                React.createElement("h4", { key: "title", className: "event__title" }, device.title),
                device.subtitle && React.createElement("span", {
                    key: "subtitle",
                    className: "event__subtitle"
                }, device.subtitle)
            ])
        );
    });

    const deviceCategories = {
        all: {
            title: "Все",
            items: generateDevices("all")
        },
        kitchen: {
            title: "Кухня",
            items: generateDevices("kitchen")
        },
        hall: {
            title: "Зал",
            items: generateDevices("hall")
        },
        lights: {
            title: "Лампочки",
            items: generateDevices("lights")
        },
        cameras: {
            title: "Камеры",
            items: generateDevices("cameras")
        }
    };

    function generateDevices(category) {
        const baseDevices = {
            all: [
                createDevice("light2", "Xiaomi Yeelight LED Smart Bulb", "Включено", "Освещение"),
                createDevice("light", "D-Link Omna 180 Cam", "Включится в 17:00", "Освещение"),
                createDevice("temp", "Elgato Eve Degree Connected", "Выключено до 17:00", "Температура")
            ],
            kitchen: [
                createDevice("light2", "Xiaomi Yeelight LED Smart Bulb", "Включено", "Освещение"),
                createDevice("temp", "Elgato Eve Degree Connected", "Выключено до 17:00", "Температура")
            ],
            hall: [
                createDevice("light", "Philips Zhirui", "Выключено", "Освещение"),
                createDevice("light2", "Xiaomi Mi Air Purifier 2S", "Выключено", "Освещение")
            ],
            lights: [
                createDevice("light", "D-Link Omna 180 Cam", "Включится в 17:00", "Освещение"),
                createDevice("light", "LIFX Mini Day & Dusk A60 E27", "Включится в 17:00", "Освещение")
            ],
            cameras: [
                createDevice("light2", "Xiaomi Mi Air Purifier 2S", "Включено", "Освещение")
            ]
        };

        const devices = [];
        const count = category === "all" ? 48 : baseDevices[category].length;
        
        for (let i = 0; i < count; i++) {
            const base = baseDevices[category][i % baseDevices[category].length];
            devices.push({
                ...base,
                id: `${category}-${i}`
            });
        }
        return devices;
    }

    function createDevice(icon, title, subtitle, iconLabel, compact = false) {
        return { icon, title, subtitle, iconLabel, compact, id: "" };
    }

    const Header = React.memo(function Header() {
        const [menuState, setMenuState] = React.useState({
            expanded: false,
            wasToggled: false
        });

        const toggleMenu = () => {
            setMenuState(prev => ({
                expanded: !prev.expanded,
                wasToggled: true
            }));
        };

        return React.createElement("header", { className: "header" }, [
            React.createElement("a", {
                key: "logo",
                href: "/",
                className: "header__logo",
                "aria-label": "Яндекс.Дом"
            }),
            React.createElement("button", {
                key: "menu",
                className: "header__menu",
                "aria-expanded": menuState.expanded,
                onClick: toggleMenu
            },
                React.createElement("span", { 
                    className: "header__menu-text a11y-hidden" 
                }, menuState.expanded ? "Закрыть меню" : "Открыть меню")
            ),
            React.createElement("ul", {
                key: "nav",
                className: `header__links${menuState.expanded ? " header__links_opened" : ""}${menuState.wasToggled ? " header__links-toggled" : ""}`
            }, [
                React.createElement("li", { key: "summary", className: "header__item" },
                    React.createElement("a", {
                        className: "header__link header__link_current",
                        href: "/",
                        "aria-current": "page"
                    }, "Сводка")
                ),
                React.createElement("li", { key: "devices", className: "header__item" },
                    React.createElement("a", { className: "header__link", href: "/devices" }, "Устройства")
                ),
                React.createElement("li", { key: "scripts", className: "header__item" },
                    React.createElement("a", { className: "header__link", href: "/scripts" }, "Сценарии")
                )
            ])
        ]);
    });

    const Dashboard = React.memo(function Dashboard() {
        return React.createElement("div", { className: "hero-dashboard" }, [
            React.createElement("div", { key: "primary", className: "hero-dashboard__primary" }, [
                React.createElement("h3", { key: "title", className: "hero-dashboard__title" }, "Привет, Геннадий!"),
                React.createElement("p", { key: "subtitle", className: "hero-dashboard__subtitle" }, 
                    "Двери и окна закрыты, сигнализация включена."
                ),
                React.createElement("ul", { key: "info", className: "hero-dashboard__info" }, [
                    createInfoItem("Дома", "+23"),
                    createInfoItem("За окном", "+19", "rain")
                ])
            ]),
            React.createElement("ul", { key: "schedule", className: "hero-dashboard__schedule" }, [
                createDevice("temp", "Philips Cooler", "Начнет охлаждать в 16:30", "Температура"),
                createDevice("light", "Xiaomi Yeelight LED Smart Bulb", "Включится в 17:00", "Освещение")
            ].map((device, i) => React.createElement(DeviceCard, { key: i, device })))
        ]);

        function createInfoItem(title, value, icon) {
            return React.createElement("li", { key: title, className: "hero-dashboard__item" }, [
                React.createElement("div", { key: "title", className: "hero-dashboard__item-title" }, title),
                React.createElement("div", { key: "value", className: "hero-dashboard__item-details" }, [
                    value,
                    React.createElement("span", { key: "deg", className: "a11y-hidden" }, "°"),
                    icon && React.createElement("div", {
                        key: "icon",
                        className: `hero-dashboard__icon hero-dashboard__icon_${icon}`,
                        role: "img",
                        "aria-label": icon === "rain" ? "Дождь" : ""
                    })
                ])
            ]);
        }
    });

    const App = React.memo(function App() {
        const [state, setState] = React.useState({
            activeTab: "all",
            hasScroll: false,
            deviceSizes: {},
            renderedTabs: {}
        });

        const containerRef = React.useRef();
        const initialized = React.useRef(false);

        React.useEffect(() => {
            if (!initialized.current) {
                initialized.current = true;
                const params = new URLSearchParams(window.location.search);
                const tab = params.get("tab");
                if (tab && deviceCategories[tab]) {
                    setState(prev => ({ ...prev, activeTab: tab }));
                }
            }
        }, []);

        const handleTabChange = React.useCallback((tab) => {
            setState(prev => ({ ...prev, activeTab: tab }));
        }, []);

        const handleSize = React.useCallback((id, size) => {
            setState(prev => {
                if (prev.deviceSizes[id]?.width === size.width && prev.deviceSizes[id]?.height === size.height) {
                    return prev;
                }
                return {
                    ...prev,
                    deviceSizes: { ...prev.deviceSizes, [id]: size }
                };
            });
        }, []);

        React.useLayoutEffect(() => {
            if (!containerRef.current || !state.activeTab) return;
            
            const panel = containerRef.current.querySelector(".section__panel:not(.section__panel_hidden)");
            if (!panel) return;

            let totalWidth = 0;
            const currentDevices = deviceCategories[state.activeTab].items;
            
            for (let i = 0; i < Math.min(currentDevices.length, 50); i++) {
                const id = `${state.activeTab}-${i}`;
                if (state.deviceSizes[id]) {
                    totalWidth += state.deviceSizes[id].width;
                    if (totalWidth > panel.clientWidth) {
                        setState(prev => ({ ...prev, hasScroll: true }));
                        return;
                    }
                }
            }
            setState(prev => ({ ...prev, hasScroll: false }));
        }, [state.deviceSizes, state.activeTab]);

        const scrollPanel = React.useCallback(() => {
            const panel = containerRef.current?.querySelector(".section__panel:not(.section__panel_hidden)");
            panel?.scrollBy({ left: 400, behavior: "smooth" });
        }, []);

        const renderDevices = React.useCallback((tab) => {
            return deviceCategories[tab].items.map((device) =>
                React.createElement(DeviceCard, {
                    key: device.id,
                    device,
                    reportSize: handleSize
                })
            );
        }, [handleSize]);

        React.useEffect(() => {
            if (state.activeTab && !state.renderedTabs[state.activeTab]) {
                setState(prev => ({
                    ...prev,
                    renderedTabs: {
                        ...prev.renderedTabs,
                        [state.activeTab]: renderDevices(state.activeTab)
                    }
                }));
            }
        }, [state.activeTab, renderDevices, state.renderedTabs]);

        return React.createElement(React.Fragment, null, [
            React.createElement("main", { key: "main", className: "main" }, [
                React.createElement("section", { key: "general", className: "section main__general" }, [
                    React.createElement("h2", {
                        key: "title",
                        className: "section__title section__title-header section__main-title"
                    }, "Главное"),
                    React.createElement(Dashboard, { key: "dashboard" })
                ]),
                React.createElement("section", { key: "scripts", className: "section main__scripts" }, [
                    React.createElement("h2", {
                        key: "title",
                        className: "section__title section__title-header"
                    }, "Избранные сценарии"),
                    React.createElement("ul", { key: "grid", className: "event-grid" }, [
                        createDevice("light2", "Выключить весь свет в доме и во дворе", null, "Освещение", true),
                        createDevice("schedule", "Я ухожу", null, "Расписание", true),
                        createDevice("light2", "Включить свет в коридоре", null, "Освещение", true)
                    ].map((device, i) => React.createElement(DeviceCard, { key: i, device }))
                )
                ]),
                React.createElement("section", { key: "devices", className: "section main__devices" }, [
                    React.createElement("div", { key: "header", className: "section__title" }, [
                        React.createElement("h2", {
                            key: "title",
                            className: "section__title-header"
                        }, "Избранные устройства"),
                        React.createElement("select", {
                            key: "select",
                            className: "section__select",
                            value: state.activeTab,
                            onChange: (e) => handleTabChange(e.target.value)
                        }, Object.keys(deviceCategories).map(key =>
                            React.createElement("option", { key, value: key }, deviceCategories[key].title)
                        )),
                        React.createElement("ul", {
                            key: "tabs",
                            role: "tablist",
                            className: "section__tabs"
                        }, Object.keys(deviceCategories).map(key =>
                            React.createElement("li", {
                                key,
                                role: "tab",
                                "aria-selected": key === state.activeTab ? "true" : "false",
                                className: `section__tab${key === state.activeTab ? " section__tab_active" : ""}`,
                                onClick: () => handleTabChange(key)
                            }, deviceCategories[key].title)
                        ))
                    ]),
                    React.createElement("div", {
                        key: "panel",
                        className: "section__panel-wrapper",
                        ref: containerRef
                    }, [
                        Object.keys(deviceCategories).map(key =>
                            React.createElement("div", {
                                key,
                                role: "tabpanel",
                                className: `section__panel${key === state.activeTab ? "" : " section__panel_hidden"}`,
                                "aria-hidden": key !== state.activeTab
                            }, React.createElement("ul", { className: "section__panel-list" },
                                state.renderedTabs[key] || null
                            ))
                        ),
                        state.hasScroll && React.createElement("div", {
                            key: "arrow",
                            className: "section__arrow",
                            onClick: scrollPanel
                        })
                    ])
                ])
            ])
        ]);
    });

    document.addEventListener("DOMContentLoaded", () => {
        const appRoot = document.getElementById("app");
        if (appRoot) {
            const root = ReactDOM.createRoot(appRoot);
            root.render(React.createElement(App));
        }
    });
})();