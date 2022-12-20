

img_sizes=(192x192 192x320 256x320 256x416 288x480 320x320 384x640 416x416 480x640 480x800 544x960 640x640 736x1280)
#img_sizes=(192x192)
kinds=(yolo_free_nano yolo_free_nano_crowdhuman yolo_free_nano_widerface)
#kinds=(yolo_free_nano)

for size in ${img_sizes[@]}; do
    for kind in ${kinds[@]}; do

        PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python onnx2tf -i /models/${kind}_${size}_post.onnx -o /models/tflite_${kind}_${size}_post --output_signaturedefs
        
        PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model --signature_name=serving_default  --saved_model_tags=serve /models/tflite_${kind}_${size}_post /models/tfjs/tfjs_${kind}_${size}_post 

    done
done
