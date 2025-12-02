export async function registerUser(data: {
  email: string
  password: string
}): Promise<void> {
  await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function verifyEmail(token: string): Promise<void> {
  await fetch(`http://localhost:5000/api/auth/verify/${token}`)
}

export async function loginUser(data: {
  email: string
  password: string
}): Promise<void> {
  await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}
