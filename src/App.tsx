interface Bookmark {
  id: string;
  title: string;
  url: string;
}

const STORAGE_KEY = "bookmarks";

const form = document.querySelector<HTMLFormElement>("#bookmarkForm")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const urlInput = document.querySelector<HTMLInputElement>("#url")!;
const bookmarkList = document.querySelector<HTMLDivElement>("#bookmarkList")!;

// Get bookmarks from localStorage
function getBookmarks(): Bookmark[] {
  const bookmarks = localStorage.getItem(STORAGE_KEY);

  return bookmarks ? JSON.parse(bookmarks) : [];
}

// Save bookmarks to localStorage
function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

// Generate a unique ID
function generateId(): string {
  return crypto.randomUUID();
}

// Render bookmarks
function renderBookmarks(): void {
  const bookmarks = getBookmarks();

  bookmarkList.innerHTML = "";

  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = "<p>No bookmarks yet.</p>";
    return;
  }

  bookmarks.forEach((bookmark) => {
    const bookmarkElement = document.createElement("div");

    bookmarkElement.className = "bookmark";

    bookmarkElement.innerHTML = `
    <div class="bookmark-card">
      <div>
        <strong>${escapeHtml(bookmark.title)}</strong>
        <br />
        <a
          href="${escapeHtml(bookmark.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${escapeHtml(bookmark.url)}
        </a>
      </div>

      <div class="actions">
        <button data-action="edit" data-id="${bookmark.id}">
          Edit
        </button>

        <button data-action="delete" data-id="${bookmark.id}">
          Delete
        </button>
      </div>
      </div>
    `;

    bookmarkList.appendChild(bookmarkElement);
  });
}

// Add bookmark
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (!title || !url) {
    return;
  }

  const bookmarks = getBookmarks();

  const newBookmark: Bookmark = {
    id: generateId(),
    title,
    url,
  };

  bookmarks.push(newBookmark);

  saveBookmarks(bookmarks);
  console.log(bookmarks)

  form.reset();

  renderBookmarks();
});

// Handle edit/delete buttons
bookmarkList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  const button = target.closest<HTMLButtonElement>("button");

  if (!button) {
    return;
  }

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (!id) {
    return;
  }

  if (action === "delete") {
    deleteBookmark(id);
  }

  if (action === "edit") {
    updateBookmark(id);
  }
});

// Delete bookmark
function deleteBookmark(id: string): void {
  const bookmarks = getBookmarks();

  const filteredBookmarks = bookmarks.filter(
    (bookmark) => bookmark.id !== id
  );

  saveBookmarks(filteredBookmarks);

  renderBookmarks();
}

// Update bookmark
function updateBookmark(id: string): void {
  const bookmarks = getBookmarks();

  const bookmark = bookmarks.find(
    (bookmark) => bookmark.id === id
  );

  if (!bookmark) {
    return;
  }

  const newTitle = prompt("Enter new title:", bookmark.title);
  const newUrl = prompt("Enter new URL:", bookmark.url);

  if (!newTitle || !newUrl) {
    return;
  }

  bookmark.title = newTitle.trim();
  bookmark.url = newUrl.trim();

  saveBookmarks(bookmarks);

  renderBookmarks();
}

// Basic HTML escaping
function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

// Initial render
renderBookmarks();
