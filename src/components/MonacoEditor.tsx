import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/components/theme-provider";

// 检测是否为移动设备
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
};
interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height: string;
}

export function MonacoEditor({
  language,
  value,
  onChange,
  height,
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const isMobile = isMobileDevice();

      const newEditor = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: theme === "dark" ? "vs-dark" : "vs-light",
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: isMobile ? 16 : 14, // 移动端使用更大字体
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        scrollBeyondLastColumn: 5, // 允许少量横向滚动
        readOnly: false,
        cursorStyle: "line",
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        tabCompletion: "on",
        parameterHints: {
          enabled: true,
        },
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        // 移动端支持配置
        contextmenu: true, // 启用右键菜单
        selectOnLineNumbers: true, // 允许点击行号选择
        multiCursorModifier: "ctrlCmd", // 多光标修饰键
        // 触摸设备优化
        mouseWheelZoom: false, // 禁用鼠标滚轮缩放，避免移动端误触
        wordWrap: "off", // 关闭自动换行以启用横向滚动
        wordWrapColumn: 120, // 增加换行列数
        // 滚动优化
        smoothScrolling: true,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: isMobile ? 14 : 10, // 移动端更大的滚动条
          horizontalScrollbarSize: isMobile ? 14 : 10,
          // 移动端滚动条优化
          ...(isMobile && {
            handleMouseWheel: true,
            alwaysConsumeMouseWheel: false,
          }),
        },
        // 移动端特定配置
        ...(isMobile && {
          // 启用触摸支持
          mouseStyle: "default",
          // 优化触摸体验
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          // 启用悬停提示，但延迟显示
          hover: {
            enabled: true,
            delay: 1000, // 1秒延迟，避免误触
            sticky: true, // 悬停提示保持显示
          },
          // 启用拖拽，但优化触摸体验
          dragAndDrop: true,
          // 优化选择体验
          selectionHighlight: true,
          occurrencesHighlight: "singleFile",
          // 移动端特定的编辑器行为
          links: true, // 启用链接点击
          colorDecorators: true, // 启用颜色装饰器
          // 移动端字体加粗
          fontWeight: "500",
        }),
      });

      setEditor(newEditor);

      newEditor.onDidChangeModelContent(() => {
        onChange(newEditor.getValue());
      });

      // 移动端特殊处理
      if (isMobile) {
        // 添加触摸事件监听器以改善移动端体验
        const editorDomNode = newEditor.getDomNode();
        if (editorDomNode) {
          // 防止页面滚动干扰编辑器滚动
          editorDomNode.addEventListener('touchstart', (e) => {
            e.stopPropagation();
          }, { passive: true });

          editorDomNode.addEventListener('touchmove', (e) => {
            e.stopPropagation();
          }, { passive: true });

          // 长按事件处理，确保上下文菜单能正常显示
          let longPressTimer: NodeJS.Timeout;
          editorDomNode.addEventListener('touchstart', () => {
            longPressTimer = setTimeout(() => {
              // 触发上下文菜单
              const position = newEditor.getPosition();
              if (position) {
                newEditor.trigger('mouse', 'editor.action.showContextMenu', {});
              }
            }, 500); // 500ms长按
          });

          editorDomNode.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
          });

          editorDomNode.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
          });
        }

        // 确保编辑器支持横向滚动和触摸操作
        newEditor.updateOptions({
          scrollbar: {
            horizontal: 'visible',
            vertical: 'visible',
            horizontalScrollbarSize: 14,
            verticalScrollbarSize: 14,
            handleMouseWheel: true,
            alwaysConsumeMouseWheel: false,
          },
          // 强制启用横向滚动
          scrollBeyondLastColumn: 10,
          wordWrap: 'off', // 关闭自动换行以启用横向滚动
          // 移动端字体加粗
          fontWeight: "500",
        });
      }

      return () => {
        newEditor.dispose();
      };
    }
  }, [language, onChange, theme]);

  useEffect(() => {
    if (editor) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
    }
  }, [theme, editor]);

  return (
    <div className="w-full h-full">
      <div
        ref={editorRef}
        style={{
          height,
          width: "100%",
          // 移动端特殊样式
          ...(isMobileDevice() && {
            touchAction: 'pan-x pan-y',
            WebkitOverflowScrolling: 'touch',
            overflow: 'auto'
          })
        }}
        className="monaco-editor-container"
        // 确保移动端触摸事件正常工作
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      />
    </div>
  );
}
