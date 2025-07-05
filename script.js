(function() {
    "use strict";

    const Event = React.memo(function Event(props) {
        const ref = React.useRef();
        const { onSize } = props;

        React.useEffect(() => {
            if (onSize && ref.current) {
                const width = ref.current.offsetWidth;
                const height = ref.current.offsetHeight;
                onSize({ width, height });
            }
        }, [onSize]);

        return React.createElement("li", {
            ref: ref,
            className: `event${props.slim ? " event_slim" : ""}`
        },
            React.createElement("button", { className: "event__button" }, [
                React.createElement("span", {
                    className: `event__icon event__icon_${props.icon}`,
                    role: "img",
                    "aria-label": props.iconLabel
                }),
                React.createElement("h4", { className: "event__title" }, props.title),
                props.subtitle && React.createElement("span", { className: "event__subtitle" }, props.subtitle)
            ])
        );
    });

    const TABS = {
        all: {
            title: 'Все',
            items: Array(48).fill().flatMap((_, i) => [
                {
                    icon: 'light2',
                    iconLabel: 'Освещение',
                    title: 'Xiaomi Yeelight LED Smart Bulb',
                    subtitle: 'Включено'
                },
                {
                    icon: 'light',
                    iconLabel: 'Освещение',
                    title: 'D-Link Omna 180 Cam',
                    subtitle: 'Включится в 17:00'
                },
                {
                    icon: 'temp',
                    iconLabel: 'Температура',
                    title: 'Elgato Eve Degree Connected',
                    subtitle: 'Выключено до 17:00'
                }
            ]).slice(0, 48)
        },
        kitchen: {
            title: 'Кухня',
            items: [
                {
                    icon: 'light2',
                    iconLabel: 'Освещение',
                    title: 'Xiaomi Yeelight LED Smart Bulb',
                    subtitle: 'Включено'
                },
                {
                    icon: 'temp',
                    iconLabel: 'Температура',
                    title: 'Elgato Eve Degree Connected',
                    subtitle: 'Выключено до 17:00'
                }
            ]
        },
        hall: {
            title: 'Зал',
            items: [
                {
                    icon: 'light',
                    iconLabel: 'Освещение',
                    title: 'Philips Zhirui',
                    subtitle: 'Выключено'
                },
                {
                    icon: 'light2',
                    iconLabel: 'Освещение',
                    title: 'Xiaomi Mi Air Purifier 2S',
                    subtitle: 'Выключено'
                }
            ]
        },
        lights: {
            title: 'Лампочки',
            items: [
                {
                    icon: 'light',
                    iconLabel: 'Освещение',
                    title: 'D-Link Omna 180 Cam',
                    subtitle: 'Включится в 17:00'
                },
                {
                    icon: 'light',
                    iconLabel: 'Освещение',
                    title: 'LIFX Mini Day & Dusk A60 E27',
                    subtitle: 'Включится в 17:00'
                },
                {
                    icon: 'light2',
                    iconLabel: 'Освещение',
                    title: 'Xiaomi Mi Air Purifier 2S',
                    subtitle: 'Включено'
                },
                {
                    icon: 'light',
                    iconLabel: 'Освещение',
                    title: 'Philips Zhirui',
                    subtitle: 'Включено'
                }
            ]
        },
        cameras: {
            title: 'Камеры',
            items: [
                {
                    icon: 'light2',
                    iconLabel: 'Освещение',
                    title: 'Xiaomi Mi Air Purifier 2S',
                    subtitle: 'Включено'
                }
            ]
        }
    };

    const TABS_KEYS = Object.keys(TABS);

    function Header() {
        const [expanded, setExpanded] = React.useState(false);
        const [toggled, setToggled] = React.useState(false);

        const onClick = () => {
            if (!toggled) setToggled(true);
            setExpanded(!expanded);
        };

        return React.createElement("header", { className: "header" }, [
            React.createElement("a", {
                href: "/",
                className: "header__logo",
                "aria-label": "Яндекс.Дом"
            }),
            React.createElement("button", {
                className: "header__menu",
                "aria-expanded": expanded,
                onClick: onClick
            }, React.createElement("span", {
                className: "header__menu-text a11y-hidden"
            }, expanded ? "Закрыть меню" : "Открыть меню")),
            React.createElement("ul", {
                className: `header__links${expanded ? " header__links_opened" : ""}${toggled ? " header__links-toggled" : ""}`
            }, [
                React.createElement("li", { className: "header__item" },
                    React.createElement("a", {
                        className: "header__link header__link_current",
                        href: "/",
                        "aria-current": "page"
                    }, "Сводка")
                ),
                React.createElement("li", { className: "header__item" },
                    React.createElement("a", { className: "header__link", href: "/devices" }, "Устройства")
                ),
                React.createElement("li", { className: "header__item" },
                    React.createElement("a", { className: "header__link", href: "/scripts" }, "Сценарии")
                )
            ])
        ]);
    }

    function Main() {
        const ref = React.useRef();
        const initedRef = React.useRef(false);
        const [activeTab, setActiveTab] = React.useState('');
        const [hasRightScroll, setHasRightScroll] = React.useState(false);
        const [sizes, setSizes] = React.useState([]);

        React.useEffect(() => {
            if (!activeTab && !initedRef.current) {
                initedRef.current = true;
                setActiveTab(new URLSearchParams(window.location.search).get('tab') || 'all');
            }
        }, [activeTab]);

        const onSelectInput = event => {
            setActiveTab(event.target.value);
        };

        const onSize = size => {
            setSizes(prev => [...prev, size]);
        };

        React.useEffect(() => {
            if (!ref.current || sizes.length === 0) return;
            
            const sumWidth = sizes.reduce((acc, item) => acc + item.width, 0);
            const newHasRightScroll = sumWidth > ref.current.offsetWidth;
            if (newHasRightScroll !== hasRightScroll) {
                setHasRightScroll(newHasRightScroll);
            }
        }, [sizes, hasRightScroll]);

        const onArrowClick = () => {
            const scroller = ref.current.querySelector('.section__panel:not(.section__panel_hidden)');
            if (scroller) {
                scroller.scrollTo({
                    left: scroller.scrollLeft + 400,
                    behavior: 'smooth'
                });
            }
        };

        return React.createElement("main", { className: "main" }, [
            React.createElement("section", { className: "section main__general" }, [
                React.createElement("h2", {
                    className: "section__title section__title-header section__main-title"
                }, "Главное"),
                React.createElement("div", { className: "hero-dashboard" }, [
                    React.createElement("div", { className: "hero-dashboard__primary" }, [
                        React.createElement("h3", { className: "hero-dashboard__title" }, "Привет, Геннадий!"),
                        React.createElement("p", { className: "hero-dashboard__subtitle" }, 
                            "Двери и окна закрыты, сигнализация включена."
                        ),
                        React.createElement("ul", { className: "hero-dashboard__info" }, [
                            React.createElement("li", { className: "hero-dashboard__item" }, [
                                React.createElement("div", { className: "hero-dashboard__item-title" }, "Дома"),
                                React.createElement("div", { className: "hero-dashboard__item-details" }, [
                                    "+23",
                                    React.createElement("span", { className: "a11y-hidden" }, "°")
                                ])
                            ]),
                            React.createElement("li", { className: "hero-dashboard__item" }, [
                                React.createElement("div", { className: "hero-dashboard__item-title" }, "За окном"),
                                React.createElement("div", { className: "hero-dashboard__item-details" }, [
                                    "+19",
                                    React.createElement("span", { className: "a11y-hidden" }, "°"),
                                    React.createElement("div", {
                                        className: "hero-dashboard__icon hero-dashboard__icon_rain",
                                        role: "img",
                                        "aria-label": "Дождь"
                                    })
                                ])
                            ])
                        ])
                    ]),
                    React.createElement("ul", { className: "hero-dashboard__schedule" }, [
                        React.createElement(Event, {
                            icon: "temp",
                            iconLabel: "Температура",
                            title: "Philips Cooler",
                            subtitle: "Начнет охлаждать в 16:30"
                        }),
                        React.createElement(Event, {
                            icon: "light",
                            iconLabel: "Освещение",
                            title: "Xiaomi Yeelight LED Smart Bulb",
                            subtitle: "Включится в 17:00"
                        }),
                        React.createElement(Event, {
                            icon: "light",
                            iconLabel: "Освещение",
                            title: "Xiaomi Yeelight LED Smart Bulb",
                            subtitle: "Включится в 17:00"
                        })
                    ])
                ])
            ]),
            React.createElement("section", { className: "section main__scripts" }, [
                React.createElement("h2", { className: "section__title section__title-header" }, "Избранные сценарии"),
                React.createElement("ul", { className: "event-grid" }, [
                    React.createElement(Event, {
                        slim: true,
                        icon: "light2",
                        iconLabel: "Освещение",
                        title: "Выключить весь свет в доме и во дворе"
                    }),
                    React.createElement(Event, {
                        slim: true,
                        icon: "schedule",
                        iconLabel: "Расписание",
                        title: "Я ухожу"
                    }),
                    React.createElement(Event, {
                        slim: true,
                        icon: "light2",
                        iconLabel: "Освещение",
                        title: "Включить свет в коридоре"
                    }),
                    React.createElement(Event, {
                        slim: true,
                        icon: "temp2",
                        iconLabel: "Температура",
                        title: "Набрать горячую ванну",
                        subtitle: "Начнётся в 18:00"
                    }),
                    React.createElement(Event, {
                        slim: true,
                        icon: "temp2",
                        iconLabel: "Температура",
                        title: "Сделать пол тёплым во всей квартире"
                    })
                ])
            ]),
            React.createElement("section", { className: "section main__devices" }, [
                React.createElement("div", { className: "section__title" }, [
                    React.createElement("h2", { className: "section__title-header" }, "Избранные устройства"),
                    React.createElement("select", {
                        className: "section__select",
                        defaultValue: "all",
                        onInput: onSelectInput
                    }, TABS_KEYS.map(key =>
                        React.createElement("option", { key: key, value: key }, TABS[key].title)
                    )),
                    React.createElement("ul", { role: "tablist", className: "section__tabs" }, TABS_KEYS.map(key =>
                        React.createElement("li", {
                            key: key,
                            role: "tab",
                            "aria-selected": key === activeTab ? "true" : "false",
                            tabIndex: key === activeTab ? "0" : undefined,
                            className: `section__tab${key === activeTab ? " section__tab_active" : ""}`,
                            id: `tab_${key}`,
                            "aria-controls": `panel_${key}`,
                            onClick: () => setActiveTab(key)
                        }, TABS[key].title)
                    ))
                ]),
                React.createElement("div", { className: "section__panel-wrapper", ref: ref }, [
                    TABS_KEYS.map(key =>
                        React.createElement("div", {
                            key: key,
                            role: "tabpanel",
                            className: `section__panel${key === activeTab ? "" : " section__panel_hidden"}`,
                            "aria-hidden": key !== activeTab,
                            id: `panel_${key}`,
                            "aria-labelledby": `tab_${key}`
                        }, React.createElement("ul", { className: "section__panel-list" },
                            TABS[key].items.map((item, index) =>
                                React.createElement(Event, {
                                    key: index,
                                    ...item,
                                    onSize: key === activeTab ? onSize : undefined
                                })
                            )
                        ))
                    ),
                    hasRightScroll && React.createElement("div", {
                        className: "section__arrow",
                        onClick: onArrowClick
                    })
                ])
            ])
        ]);
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            const root = ReactDOM.createRoot(document.getElementById('app'));
            root.render(React.createElement(React.Fragment, null, [
                React.createElement(Header),
                React.createElement(Main)
            ]));
        }, 100);
    });
})();