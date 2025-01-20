// src/components/models/ModelsView.tsx
import { Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { Header } from '../components/header'
import { createStorage } from '../tauri/storage'
import { useTauriContext } from '../tauri/TauriProvider'
import { Model, ModelParameter, ModelEditForm, ModelParameters, ModelOverview} from '../components/models'

const DEFAULT_MODELS: Model[] = [
  {
    id: "deepseek-v3",
    name: "deepseek-v3",
    modelId: "deepseek-chat",
    provider: "Custom",
    contextLength: 64000,
    apiType: "openai",
    pluginsSupported: true,
    visionSupported: false,
    streamingSupported: true,
    systemRoleSupported: true,
    promptCachingSupported: false,
    apiEndpoint: "https://api.deepseek.com/beta/chat/completions",
    pricing: {
      input: 0.28,
      output: 1.14
    },
    isEnabled: true,
    parameters: {
      contextLimit: "All",
      temperature: 0.7,
      presencePenalty: 0,
      frequencyPenalty: 0,
      topP: 1,
      maxTokens: 2048,
      overrideGlobal: false
    }
  },
  // ... 其他默认模型
]

export function ModelsView() {
  const { fileSep, documents } = useTauriContext()
  const storeName = `${documents}${fileSep}models.json`
  const { use: useStoredValue, loading } = createStorage(storeName)

  const [models, setModels] = useStoredValue('models', DEFAULT_MODELS)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProvider, setFilterProvider] = useState('All')
  const [isEditing, setIsEditing] = useState(false)

  const filteredModels = models.filter((model: Model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvider = filterProvider === 'All' || model.provider === filterProvider
    return matchesSearch && matchesProvider
  })

  const currentModel = models.find((m: Model) => m.id === selectedModel)

  const handleAddModel = () => {
    setSelectedModel(null)
    setIsEditing(true)
  }

  const handleEditModel = () => {
    if (selectedModel) {
      setIsEditing(true)
    }
  }

  const handleSaveModel = (modelData: Model) => {
    if (selectedModel) {
      // 编辑现有模型
      setModels(models.map((m: Model) => m.id === selectedModel ? modelData : m))
    } else {
      // 添加新模型
      setModels([...models, modelData])
      setSelectedModel(modelData.id)
    }
    setIsEditing(false)
    notifications.show({
      title: 'Success',
      message: `Model ${selectedModel ? 'updated' : 'added'} successfully`,
      color: 'green'
    })
  }

  const handleDeleteModel = (modelId: string) => {
    setModels(models.filter((m: Model) => m.id !== modelId))
    setSelectedModel(null)
    notifications.show({
      title: 'Success',
      message: 'Model deleted successfully',
      color: 'green'
    })
  }

  const handleDuplicateModel = (modelId: string) => {
    const modelToDuplicate = models.find((m: Model) => m.id === modelId)
    if (!modelToDuplicate) return

    const duplicatedModel: Model = {
      ...modelToDuplicate,
      id: `${modelToDuplicate.id}-copy-${Date.now()}`,
      name: `${modelToDuplicate.name} (Copy)`,
      isEnabled: false
    }

    setModels([...models, duplicatedModel])
    setSelectedModel(duplicatedModel.id)
    notifications.show({
      title: 'Success',
      message: 'Model duplicated successfully',
      color: 'green'
    })
  }

  const handleSetDefault = (modelId: string) => {
    setModels(models.map((model: Model): Model => ({
      ...model,
      isEnabled: model.id === modelId
    })))
    notifications.show({
      title: 'Success',
      message: 'Default model updated successfully',
      color: 'green'
    })
  }

  const handleUpdateParameters = (modelId: string, parameters: Partial<ModelParameter>) => {
    setModels(models.map((model: Model) =>
      model.id === modelId
        ? { ...model, parameters: { ...model.parameters, ...parameters } }
        : model
    ))
    notifications.show({
      title: 'Success',
      message: 'Model parameters updated successfully',
      color: 'green'
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading models...</div>
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <Header>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedModel ? 'Edit Model' : 'Add New Model'}
            </span>
          </div>
        </Header>
        <div className="mt-6">
          <ModelEditForm
            model={currentModel}
            onSave={handleSaveModel}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Models</span>
        </div>
      </Header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Models List */}
        <div className="w-96 border-r border-light-border dark:border-dark-border p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Models</h1>
            <button
              onClick={handleAddModel}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Custom Model
            </button>
          </div>

          {/* Global Settings */}
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg bg-light-accent dark:bg-dark-accent hover:bg-light-accent/70 dark:hover:bg-dark-accent/70">
            <Settings className="w-5 h-5" />
            <span>Global Settings</span>
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search models..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border"
            />
          </div>

          {/* Provider Filters */}
          <div className="flex space-x-2 border-b border-light-border dark:border-dark-border">
            {['All', 'Custom', 'Google', 'OpenAI', 'Anthropic'].map((provider) => (
              <button
                key={provider}
                onClick={() => setFilterProvider(provider)}
                className={`px-4 py-2 text-sm ${filterProvider === provider ? 'border-b-2 border-blue-500' : ''}`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Model List */}
          <div className="space-y-2">
            {filteredModels.map((model: Model) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg cursor-pointer ${selectedModel === model.id
                  ? 'bg-light-accent dark:bg-dark-accent'
                  : 'hover:bg-light-accent/70 dark:hover:bg-dark-accent/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {model.provider[0]}
                    </div>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.contextLength.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Model Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentModel && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {currentModel.provider[0]}
                  </div>
                  <h2 className="text-xl font-bold">{currentModel.name}</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSetDefault(currentModel.id)}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() => handleDeleteModel(currentModel.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDuplicateModel(currentModel.id)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={handleEditModel}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 border-b border-light-border dark:border-dark-border">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`px-4 py-2 ${activeTab === 'parameters' ? 'border-b-2 border-blue-500' : ''
                    }`}
                >
                  Parameters
                </button>
              </div>

              {activeTab === 'overview' ? (
                <ModelOverview model={currentModel} />
              ) : (
                <ModelParameters
                  model={currentModel}
                  onUpdate={(params) => handleUpdateParameters(currentModel.id, params)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}