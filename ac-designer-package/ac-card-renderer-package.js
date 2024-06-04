// Function to handle actions
function handleAction(action) {
    switch(action._propertyBag['type']) {
        case 'Action.OpenUrl':
            handleOpenURLAction(action);
            break;
        case 'Action.Submit':
            handleSubmitAction(action);
            break;
        case 'Action.ShowCard':
            handleShowCardAction(action);
            break;
        case 'Action.ToggleVisibility':
            handleToggleVisibilityAction(action);
            break;
        case 'Action.Execute':
            handleExecuteAction(action);
            break;
        default:
            console.log("Unhandled action:", action);
    }
}

// Function to handle open URL action
function handleOpenURLAction(action) {
    var confirmed = window.confirm("Are you sure you want to open this URL?");
    if (confirmed) {
        window.location.href = action.url;
    }
}

// Function to handle submit action
function handleSubmitAction(action) {
    // Handle Submit action
    console.log("Submit action:", action);
}

// Function to handle show card action
function handleShowCardAction(action) {
    // Handle ShowCard action
    console.log("ShowCard action:", action);
}

// Function to handle toggle visibility action
function handleToggleVisibilityAction(action) {
    // Handle ToggleVisibility action
    console.log("ToggleVisibility action:", action);
}

// Function to handle execute action
function handleExecuteAction(action) {
    // Handle Execute action
    console.log("Execute action:", action);
}

// Function to initialize the adaptive card
function renderAdaptiveCard(containerId, cardTemplatePayload, dataContext) {
    const template = new ACData.Template(cardTemplatePayload);
    const context = { $root: dataContext };
    console.log(context);
    const card = template.expand(context);
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();

    adaptiveCard.onExecuteAction = handleAction;
    adaptiveCard.parse(card);
    document.getElementById(containerId).appendChild(adaptiveCard.render());
}
