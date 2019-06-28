
/**
 * Set Page Title
 */
export function setTitle(title: string) {
    const titleElement = document.getElementById('page-title');
    (document.title = title) && titleElement && (titleElement.textContent = title)
}