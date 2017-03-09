function Tooltip(element, options) {

    var tooltip;

    tooltip = document.createElement('span');
    tooltip.className = 'ui tooltip';
    tooltip.innerHTML = element.getAttribute('title');

    element.appendChild(tooltip);
    element.removeAttribute('data-tooltip');
    element.removeAttribute('title');
    element.classList.add('ui-tooltipped');

}