export async function fetchGraph() {
  return (await fetch('/api/graph')).json()
}

export async function fetchNote(p) {
  return (await fetch(`/api/note?p=${encodeURIComponent(p)}`)).json()
}

export async function saveNote(path, content) {
  return (
    await fetch('/api/note', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    })
  ).json()
}

export async function fetchByType(type) {
  return (await fetch(`/api/notes-by-type?type=${encodeURIComponent(type)}`)).json()
}
