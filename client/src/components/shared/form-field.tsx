import type { LucideIcon } from 'lucide-react'
import { type FC } from 'react'
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form'

import { cn } from '@/shared/lib/utils'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface FormFieldProps {
    label: string
    name: string
    placeholder: string
    register: UseFormRegisterReturn
    errors?: FieldError
    required: boolean
    type?: string
    icon?: LucideIcon
    shouldReset?: boolean
}

const FormField: FC<FormFieldProps> = ({ label, name, placeholder, type = 'text', icon: Icon, register, errors, required }) => {
    return (
        <div className="flex flex-col space-y-2 relative mb-2">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-red-600">*</span>}
            </Label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <Input
                    id={name}
                    type={type}
                    {...register}
                    placeholder={placeholder}
                    className={cn(Icon ? 'pl-10' : 'pl-3', errors && 'border-red-600')}
                />
                <div className="absolute right-3 top-9">{Icon && <Icon />}</div>
                {errors && <span className="text-sm text-red-600">{errors?.message as string}</span>}
            </div>
        </div>
    )
}

export default FormField
