const BASE = "https://api.twilio.com/2010-04-01"

function auth() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) throw new Error("twilio_not_configured")
  return { sid, token, header: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64") }
}

export async function searchAvailableNumbers(country = "ES", type = "Mobile", limit = 10) {
  const { sid, header } = auth()
  const url = `${BASE}/Accounts/${sid}/AvailablePhoneNumbers/${country}/${type}.json?PageSize=${limit}`
  const res = await fetch(url, { headers: { Authorization: header } })
  if (!res.ok) throw new Error(`Twilio search failed: ${res.status}`)
  const data = await res.json()
  return (data.available_phone_numbers ?? []) as Array<{
    phone_number: string
    friendly_name: string
    locality: string
    region: string
  }>
}

export async function buyPhoneNumber(phoneNumber: string) {
  const { sid, header } = auth()
  const body = new URLSearchParams({ PhoneNumber: phoneNumber })
  const res = await fetch(`${BASE}/Accounts/${sid}/IncomingPhoneNumbers.json`, {
    method: "POST",
    headers: { Authorization: header, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Twilio buy failed: ${err}`)
  }
  return res.json() as Promise<{ sid: string; phone_number: string }>
}

export async function releasePhoneNumber(numberSid: string) {
  const { sid, header } = auth()
  const res = await fetch(`${BASE}/Accounts/${sid}/IncomingPhoneNumbers/${numberSid}.json`, {
    method: "DELETE",
    headers: { Authorization: header },
  })
  return res.ok
}

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? ""
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? ""
