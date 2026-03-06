import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

// Read SQL and strip BOM, comments, and blank lines
const raw = readFileSync('./prisma/migrations/init.sql', 'utf8')
    .replace(/^\uFEFF/, '')       // strip BOM if present
    .replace(/\r\n/g, '\n')       // normalize line endings

// Remove SQL comment lines (-- ...)
const noComments = raw
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')

// Split on semicolons to get individual statements
const statements = noComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

console.log(`Found ${statements.length} SQL statements to execute.`)

for (const statement of statements) {
    try {
        await client.execute(statement)
        console.log('✓ Executed:', statement.substring(0, 70).replace(/\n/g, ' ') + '...')
    } catch (err) {
        if (err.message && err.message.includes('already exists')) {
            console.log('⚠ Skipped (already exists):', statement.substring(0, 50))
        } else {
            console.error('✗ Failed:', err.message)
            console.error('  Statement:', statement.substring(0, 100))
        }
    }
}

console.log('\nMigration complete!')
