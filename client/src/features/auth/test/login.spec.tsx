import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Login Feature', () => {
    it('login page render', () => {
        expect(screen.getAllByText('Login')).toBeTruthy()
    })
})
