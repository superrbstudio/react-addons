export default async function verifyRecaptcha(token: string) {
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`

  const response = await fetch(verificationUrl)
  const { success }: { success: boolean } = await response.json()

  return !!success
}
