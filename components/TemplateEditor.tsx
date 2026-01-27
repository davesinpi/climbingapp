
import React, { useState, useEffect } from 'react';
import { WorkoutTemplate, Block, BlockType, Exercise, ExerciseType } from '../types';
import { StorageService } from '../services/storage';

interface TemplateEditorProps {
  template?: WorkoutTemplate | null;
  onSave: (template: WorkoutTemplate) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [blocks, setBlocks] = useState<Block[]>(template?.blocks || []);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setExercises(StorageService.getExercises());
  }, []);

  const addBlock = () => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type: BlockType.Climbing,
      exercises: []
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlockType = (index: number, type: BlockType) => {
    const updated = [...blocks];
    updated[index].type = type;
    setBlocks(updated);
  };

  const addExerciseToBlock = (blockIndex: number) => {
    const updated = [...blocks];
    updated[blockIndex].exercises.push({
      exerciseId: exercises[0]?.id || '',
      targetSets: 3
    });
    setBlocks(updated);
  };

  const removeExerciseFromBlock = (blockIndex: number, exerciseIndex: number) => {
    const updated = [...blocks];
    updated[blockIndex].exercises.splice(exerciseIndex, 1);
    setBlocks(updated);
  };

  const updateBlockExercise = (blockIndex: number, exerciseIndex: number, field: string, value: any) => {
    const updated = [...blocks];
    updated[blockIndex].exercises[exerciseIndex] = {
      ...updated[blockIndex].exercises[exerciseIndex],
      [field]: value
    };
    setBlocks(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }
    const newTemplate: WorkoutTemplate = {
      id: template?.id || Math.random().toString(36).substr(2, 9),
      name,
      description,
      blocks,
      createdAt: template?.createdAt || new Date().toISOString()
    };
    onSave(newTemplate);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Sticky Header */}
      <header className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-20">
        <div>
          <h2 className="text-2xl font-bold dark:text-white leading-tight">{template ? 'Edit Template' : 'New Template'}</h2>
          <p className="text-slate-500 text-xs">Design your training structure</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">Save</button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Workout Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Power Endurance Focus"
              className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none py-2 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is the goal of this session?"
              className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm dark:text-slate-200 border border-transparent focus:border-indigo-500 outline-none min-h-[80px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-slate-100">Training Blocks</h3>
            <button 
              onClick={addBlock}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Add Block
            </button>
          </div>

          {blocks.map((block, bIdx) => (
            <div key={block.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group">
              <button 
                onClick={() => removeBlock(bIdx)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                  {bIdx + 1}
                </div>
                <select 
                  value={block.type}
                  onChange={(e) => updateBlockType(bIdx, e.target.value as BlockType)}
                  className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  {Object.values(BlockType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {block.exercises.map((be, eIdx) => (
                  <div key={eIdx} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-50 dark:border-slate-800">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exercise</label>
                      <select 
                        value={be.exerciseId}
                        onChange={(e) => updateBlockExercise(bIdx, eIdx, 'exerciseId', e.target.value)}
                        className="w-full bg-white dark:bg-slate-700 rounded-lg px-2 py-1.5 text-sm dark:text-white border border-slate-200 dark:border-slate-600"
                      >
                        {exercises.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sets</label>
                      <input 
                        type="number"
                        value={be.targetSets}
                        onChange={(e) => updateBlockExercise(bIdx, eIdx, 'targetSets', parseInt(e.target.value))}
                        className="w-full bg-white dark:bg-slate-700 rounded-lg px-2 py-1.5 text-sm text-center dark:text-white border border-slate-200 dark:border-slate-600"
                      />
                    </div>
                    <button 
                      onClick={() => removeExerciseFromBlock(bIdx, eIdx)}
                      className="p-2 text-slate-300 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addExerciseToBlock(bIdx)}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-400 transition-colors"
                >
                  + Add Exercise
                </button>
              </div>
            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-12 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-slate-400 italic text-sm">No blocks added. Start building your session!</p>
               <button onClick={addBlock} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Add First Block</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
