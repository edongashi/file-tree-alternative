import React, { useState, useRef, useEffect } from 'react';
import FileTreeAlternativePlugin from 'main';
import { MainFolder } from 'components/FolderView/MainFolder';
import { FileComponent } from 'components/FileView/FileComponent';

export const SingleView = (props: { plugin: FileTreeAlternativePlugin }) => {
    const [dividerOnMove, setDividerOnMove] = useState<boolean>(false);
    const [folderPaneHeight, setFolderPaneHeight] = useState<number>(null);
    const [clientY, setClientY] = useState<number>(null);

    let folderPaneRef = useRef<HTMLDivElement>();
    let dividerRef = useRef<HTMLDivElement>();

    let heightSetting = props.plugin.settings.customHeight;

    useEffect(() => {
        if (folderPaneHeight) {
            props.plugin.settings.customHeight = folderPaneHeight;
            props.plugin.saveSettings();
        }
    }, [folderPaneHeight]);

    function touchMouseStart(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        setDividerOnMove(true);
        let height = dividerRef.current.offsetTop - folderPaneRef.current.offsetTop;
        setFolderPaneHeight(height);
        setClientY(e.nativeEvent.clientY);
    }

    function touchMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        if (!dividerOnMove) return;
        setFolderPaneHeight(folderPaneHeight + (e.nativeEvent.clientY - clientY));
        setClientY(e.nativeEvent.clientY);
    }

    function touchMouseEnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        setDividerOnMove(false);
        setClientY(e.nativeEvent.clientY);
    }

    return (
        // Register Move & End Events for All File Tree Leaf
        <div className="file-tree-container" onMouseMove={(e) => touchMouseMove(e)} onMouseUp={(e) => touchMouseEnd(e)}>
            <div
                className="oz-folder-pane"
                ref={folderPaneRef}
                style={{ height: folderPaneHeight ? `${folderPaneHeight}px` : heightSetting !== 0 ? `${heightSetting}px` : '50%' }}>
                <MainFolder plugin={props.plugin} />
            </div>

            {/* Mouse Down Event only For Divider */}
            <div
                id="file-tree-divider"
                ref={dividerRef}
                onClick={(e) => e.preventDefault()}
                onMouseDown={(e) => touchMouseStart(e)}
                style={{ backgroundColor: dividerOnMove ? 'var(--interactive-accent)' : '' }}></div>

            <div className="oz-file-list-pane">
                <FileComponent plugin={props.plugin} />
            </div>
        </div>
    );
};
