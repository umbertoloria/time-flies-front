export async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function setAuthData(em: string, sp: string) {
  // FIXME: Very bad method (*vfbd)
  localStorage.setItem('em', em)
  localStorage.setItem('sp', sp)
}

export function resetAuthData() {
  // FIXME: Very bad method (*vfbd)
  localStorage.removeItem('em')
  localStorage.removeItem('sp')
}

export function getAuthData() {
  // FIXME: Very bad method (*vfbd)
  const em = localStorage.getItem('em') || ''
  const sp = localStorage.getItem('sp') || ''
  return {
    em,
    sp,
  }
}
