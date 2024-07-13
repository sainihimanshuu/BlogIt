import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

export default function RTE({
    name = "content",
    control,
    initialValue = "",
    label,
}) {
    return (
        <div>
            {label && <label className="mr-2 font-semibold">{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange } }) => (
                    <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API}
                        initialValue={initialValue}
                        value={value}
                        init={{
                            initialValue: initialValue,
                            height: 500,
                            menubar: true,
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                                "anchor",
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    );
}
