import { Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { Header } from '../components/header'

interface Model {
  id: string
  name: string
  provider: string
  contextSize: string
  isEnabled: boolean
}

const SAMPLE_MODELS: Model[] = [
  {
    id: "deepseek-v3",
    name: "deepseek-v3",
    provider: "DeepSeek",
    contextSize: "64K",
    isEnabled: true
  },
  {
    id: "claude-3",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextSize: "200K",
    isEnabled: false
  }
]

export function ModelsView() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters'>('overview')

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
              placeholder="Search models..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border"
            />
          </div>

          {/* Model Tabs */}
          <div className="flex space-x-2 border-b border-light-border dark:border-dark-border">
            {['All', 'Custom', 'Google', 'OpenAI', 'Anthropic'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm ${tab === 'All' ? 'border-b-2 border-blue-500' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Model List */}
          <div className="space-y-2">
            {SAMPLE_MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedModel === model.id
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
                      <div className="text-sm text-gray-500">{model.contextSize}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label
                      className={`${
                        model.isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={model.isEnabled}
                        onChange={() => {}}
                      />
                      <span
                        className={`${
                          model.isEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Model Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedModel && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    D
                  </div>
                  <h2 className="text-xl font-bold">deepseek-v3</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 rounded-lg bg-green-500 text-white">Set Default</button>
                  <button className="px-4 py-2 rounded-lg bg-red-500 text-white">Delete</button>
                  <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">Duplicate</button>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Edit</button>
                </div>
              </div>

              <div className="flex space-x-4 border-b border-light-border dark:border-dark-border">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 ${
                    activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`px-4 py-2 ${
                    activeTab === 'parameters' ? 'border-b-2 border-blue-500' : ''
                  }`}
                >
                  Parameters
                </button>
              </div>

              {activeTab === 'parameters' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <switch className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </switch>
                    <span>Override Global Model Parameters</span>
                  </div>

                  {/* Parameter Items */}
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Context Limit',
                        value: 'All',
                        description: 'The number of messages to include in the context for the AI assistant.'
                      },
                      {
                        name: 'Temperature',
                        value: 'DEFAULT',
                        description: 'Higher values will make the output more random, while lower values make it more focused.'
                      }
                    ].map((param) => (
                      <div key={param.name} className="p-4 rounded-lg bg-light-accent dark:bg-dark-accent">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-medium">{param.name}: <span className="text-gray-500">{param.value}</span></h3>
                            <p className="text-sm text-gray-500">{param.description}</p>
                          </div>
                          <button className="text-blue-500 text-sm">Change</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}