#echo run build
date +'android start build time:'%Y-%m-%d-%H-%M-%S
rm ../build_file/*.apk

cp ./android/customModules/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java

#npm install
cd android && ./gradlew assembleRelease
cd ..

cp ./android/app/build/outputs/apk/*.apk ../build_file
rm ../build_file/*unaligned.apk

date +'android end build time:'%Y-%m-%d-%H-%M-%S
