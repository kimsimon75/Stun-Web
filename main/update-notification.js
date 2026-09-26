export function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = '#fff';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.innerHTML = '웹사이트에 새로운 업데이트가 있습니다!';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '닫기';
    closeButton.style.marginLeft = '10px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#4CAF50';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => notification.remove();

    notification.appendChild(closeButton);
    document.body.appendChild(notification);
}
