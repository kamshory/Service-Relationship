var messageSpecsSource = [
    {
        from:"admin-browser",
        to:"admin-teller-web-server",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"teller-browser",
        to:"admin-teller-web-server",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"customer-browser",
        to:"mobile-web-server",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"customer-mobile",
        to:"mobile-web-server",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"admin-teller-web-server",
        to:"core-banking",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"admin-teller-web-server",
        to:"mail-server",
        protocol:"SMTP",
        connection:"close"
    },
    {
        from:"admin-teller-web-server",
        to:"app-database",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"admin-teller-web-server",
        to:"app-database-slave",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"core-banking",
        to:"app-database",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"app-database",
        to:"app-database-slave",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"core-banking",
        to:"message-brocker",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"message-brocker",
        to:"sms-gateway",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"mobile-web-server",
        to:"core-banking",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"task-scheduler",
        to:"core-banking",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"task-scheduler",
        to:"backup-system",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"backup-system",
        to:"app-database-slave",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"backup-system",
        to:"backup-server",
        protocol:"HTTP",
        connection:"close"
    },
    {
        from:"backup-system",
        to:"mail-server",
        protocol:"SMTP",
        connection:"close"
    },
    {
        from:"mobile-web-server",
        to:"mobile-database",
        protocol:"SQL",
        connection:"close"
    },
    {
        from:"sms-gateway",
        to:"customer-mobile",
        protocol:"HTTP",
        connection:"close"
    }
];