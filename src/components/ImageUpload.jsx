import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'

export default function ImageUpload({ onUpload, theme }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => onUpload(files[0])
  })

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.01 }}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${theme.uploadBorder} ${
        isDragActive ? 'opacity-70' : ''
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`mx-auto mb-2 ${theme.uploadText}`} size={22} />
      <p className={`text-sm ${theme.uploadText}`}>Drop your portfolio screenshot here</p>
      <p className={`text-xs mt-1 ${theme.muted}`}>or click to browse</p>
    </motion.div>
  )
}