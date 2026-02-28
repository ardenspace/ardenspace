import ko from './ko.json'
import en from './en.json'
import { useStore } from '../stores/useStore'

const translations = { ko, en } as const

type TranslationKey = keyof typeof ko

export function useT() {
  const lang = useStore((s) => s.lang)
  return (key: TranslationKey) => translations[lang][key] || key
}
