import FormWidget from '../FormWidget'

export default function FormWidgetExample() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return <FormWidget onSubmit={handleSubmit} />
}