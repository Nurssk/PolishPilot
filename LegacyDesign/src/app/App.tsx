import { useState } from "react";
import { Camera, Settings, X, Check, Sparkles, Layout, Zap, Image as ImageIcon, Copy, ExternalLink } from "lucide-react";

export default function App() {
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex justify-center">
      {/* Extension Panel Container */}
      <div className="w-[400px] h-screen flex flex-col relative">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-bright flex items-center justify-center shadow-lg shadow-glow">
                <span className="text-sm font-bold text-primary-foreground">DH</span>
              </div>
              <div>
                <h1 className="text-base leading-tight">Design Humanizer</h1>
                <p className="text-xs text-muted-foreground">AI UI polish assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg bg-card-elevated hover:bg-input-background transition-colors flex items-center justify-center">
                <Settings className="w-4 h-4 text-secondary-foreground" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-card-elevated hover:bg-input-background transition-colors flex items-center justify-center">
                <X className="w-4 h-4 text-secondary-foreground" />
              </button>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-input text-xs text-secondary-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            Simple Mode
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Primary Action */}
          <div className="space-y-3">
            <button
              onClick={() => setHasScreenshot(true)}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-primary-bright hover:shadow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Camera className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
              <span className="text-primary-foreground">New Screenshot</span>
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Select any UI block to analyze layout, hierarchy and polish opportunities.
            </p>
          </div>

          {/* Screenshot Card */}
          {hasScreenshot && (
            <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3 shadow-lg">
              <h3 className="text-sm">Selected Area</h3>
              <div className="aspect-video rounded-lg bg-card-elevated border border-border/30 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-card-elevated to-muted opacity-40 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-accent">
                  <Check className="w-3.5 h-3.5" />
                  <span>Screenshot ready</span>
                </div>
                <div className="flex items-center gap-1.5 text-accent">
                  <Check className="w-3.5 h-3.5" />
                  <span>Gemini connected</span>
                </div>
              </div>
              <button
                onClick={() => setIsAnalyzed(true)}
                className="w-full h-10 rounded-lg bg-primary hover:bg-primary-bright transition-colors flex items-center justify-center gap-2 text-sm text-primary-foreground"
              >
                <Sparkles className="w-4 h-4" />
                Analyze UI
              </button>
            </div>
          )}

          {/* Understanding Section */}
          {isAnalyzed && (
            <div className="space-y-4">
              <h3 className="text-sm">Understanding</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-input border border-border/30 text-xs text-secondary-foreground">
                  Features
                </span>
                <span className="px-3 py-1.5 rounded-full bg-input border border-border/30 text-xs text-secondary-foreground">
                  Equal cards
                </span>
                <span className="px-3 py-1.5 rounded-full bg-input border border-border/30 text-xs text-secondary-foreground">
                  Weak hierarchy
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This section uses repeated cards with similar visual weight. Design Humanizer can improve hierarchy by changing card size and layout rhythm.
              </p>
            </div>
          )}

          {/* Design Layouts */}
          {isAnalyzed && (
            <div className="space-y-4">
              <h3 className="text-sm">Design layouts</h3>
              <div className="space-y-3">
                {/* Bento Grid */}
                <div
                  onClick={() => setSelectedLayout(0)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedLayout === 0
                      ? "bg-card-elevated border-primary shadow-lg shadow-glow"
                      : "bg-card border-border/30 hover:border-border"
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm">Bento Grid</h4>
                      {selectedLayout === 0 && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    {/* Layout Preview */}
                    <div className="h-16 rounded-lg bg-muted border border-border/20 p-2 grid grid-cols-3 grid-rows-2 gap-1.5">
                      <div className="col-span-2 row-span-2 rounded bg-input"></div>
                      <div className="rounded bg-input"></div>
                      <div className="rounded bg-input"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Adds rhythm and hierarchy</p>
                      <button className="px-3 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs text-primary transition-colors">
                        Use
                      </button>
                    </div>
                  </div>
                </div>

                {/* Featured + Side Stack */}
                <div
                  onClick={() => setSelectedLayout(1)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedLayout === 1
                      ? "bg-card-elevated border-primary shadow-lg shadow-glow"
                      : "bg-card border-border/30 hover:border-border"
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm">Featured + Side Stack</h4>
                      {selectedLayout === 1 && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="h-16 rounded-lg bg-muted border border-border/20 p-2 grid grid-cols-2 gap-1.5">
                      <div className="rounded bg-input"></div>
                      <div className="grid grid-rows-3 gap-1.5">
                        <div className="rounded bg-input"></div>
                        <div className="rounded bg-input"></div>
                        <div className="rounded bg-input"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Makes one card dominant</p>
                      <button className="px-3 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs text-primary transition-colors">
                        Use
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center Highlight */}
                <div
                  onClick={() => setSelectedLayout(2)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedLayout === 2
                      ? "bg-card-elevated border-primary shadow-lg shadow-glow"
                      : "bg-card border-border/30 hover:border-border"
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm">Center Highlight</h4>
                      {selectedLayout === 2 && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="h-16 rounded-lg bg-muted border border-border/20 p-2 grid grid-cols-3 gap-1.5">
                      <div className="rounded bg-input opacity-60"></div>
                      <div className="rounded bg-input"></div>
                      <div className="rounded bg-input opacity-60"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Creates a clear focal point</p>
                      <button className="px-3 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs text-primary transition-colors">
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animation Ideas */}
          {isAnalyzed && (
            <div className="space-y-4">
              <h3 className="text-sm">Animation ideas</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/30 hover:bg-card-elevated transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs">Card Hover Lift</p>
                      <span className="text-xs text-muted-foreground">ReactBits reference</span>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:text-primary-bright">Add</button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/30 hover:bg-card-elevated transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs">Staggered Reveal</p>
                      <span className="text-xs text-muted-foreground">ReactBits reference</span>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:text-primary-bright">Add</button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/30 hover:bg-card-elevated transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs">Button Microinteraction</p>
                      <span className="text-xs text-muted-foreground">ReactBits reference</span>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:text-primary-bright">Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {isAnalyzed && selectedLayout !== null && (
            <div className="space-y-4">
              <h3 className="text-sm">Preview</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-bright transition-colors flex items-center justify-center gap-2 text-sm text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                    Generate AI Preview
                  </button>
                  <button className="flex-1 h-10 rounded-lg bg-card-elevated hover:bg-input-background border border-border/30 transition-colors flex items-center justify-center gap-2 text-sm text-secondary-foreground">
                    <Layout className="w-4 h-4" />
                    Open Gallery
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-muted border border-border/20 text-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Preview will open in a floating window</p>
                </div>
              </div>
            </div>
          )}

          <div className="h-20"></div>
        </div>

        {/* Bottom Action Bar - Sticky */}
        {selectedLayout !== null && (
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-background via-background to-transparent border-t border-border/50 backdrop-blur-sm">
            <div className="space-y-2">
              <button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-bright hover:shadow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 group">
                <Copy className="w-4 h-4 text-primary-foreground group-hover:scale-110 transition-transform" />
                <span className="text-primary-foreground">Copy Cursor Prompt</span>
              </button>
              <button className="w-full h-10 rounded-lg bg-card-elevated hover:bg-input-background border border-border/30 transition-colors flex items-center justify-center gap-2 text-sm text-secondary-foreground">
                <ExternalLink className="w-4 h-4" />
                Open Full Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
