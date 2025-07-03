'use client';
import { Richtext } from '@/components/Richtext';
import { useEffect, useMemo } from 'react';

declare global {
	interface Window {
		handleTemplateChange?: (event: Event) => void;
	}
}

const defaultTemplateMap = {
	fullname: '{{fullname}}',
	message: '{{message}}',
	description: '{{description}}',
};

interface RichTextEditorElement extends Element {
	ej2_instances?: Array<{
		executeCommand: (command: string, value: string) => void;
	}>;
}

export default function Home() {
	// Template placeholders mapping
	const templateMap = useMemo(() => defaultTemplateMap, []);

	useEffect(() => {
		// Define global handler for dropdown change
		window.handleTemplateChange = (event: Event) => {
			const target = event.target as HTMLSelectElement;
			const selectedValue = target.value;

			if (selectedValue) {
				// Find the RichTextEditor instance
				const rteElement = document.querySelector('.e-richtexteditor') as RichTextEditorElement;
				if (rteElement?.ej2_instances) {
					const rteObj = rteElement.ej2_instances[0];

					if (rteObj) {
						const templateValue = `{{${selectedValue}}}`;
						const replacedValue = templateMap[selectedValue as keyof typeof templateMap] || templateValue;

						// Insert the template value at current cursor position
						rteObj.executeCommand('insertText', replacedValue);

						// Reset dropdown to default option
						target.selectedIndex = 0;
					}
				}
			}
		};

		// Cleanup on unmount
		return () => {
			delete window.handleTemplateChange;
		};
	}, [templateMap]);

	return (
		<div>
			<main>
				<Richtext
					toolbarSettings={(defaultToolbarSettings) => ({
						...defaultToolbarSettings,
						items: [
							...(defaultToolbarSettings.items || []),
							{
								template: `
									<select 
										class="e-rte-dropdown e-control e-lib e-rte-elements" 
										style="
											width: 140px;
											margin: 2px;
											padding: 6px 10px;
											border-radius: 6px;
											border: 1px solid #d1d5db;
											background: #f9fafb;
											font-size: 15px;
											color: #222;
											transition: border-color 0.2s, box-shadow 0.2s;
										"
										onfocus="this.style.borderColor='#6366f1';this.style.boxShadow='0 0 0 2px #6366f133'"
										onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'"
										onmouseover="this.style.background='#f3f4f6'"
										onmouseout="this.style.background='#f9fafb'"
										onchange="window.handleTemplateChange(event)"
									>
										<option value="">Template</option>
										${Object.keys(templateMap)
											.map((key) => `<option value="${key}">${key}</option>`)
											.join('')}
									</select>
								`,
								tooltipText: 'Insert Template',
							},
						],
					})}
				/>
			</main>
		</div>
	);
}
