"use client"
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Galaxy = () => {
	const mountRef = useRef(null); // Ref to mount the canvas

	useEffect(() => {
		const gui = new dat.GUI();
		const canvas = mountRef.current;

		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		const scene = new THREE.Scene();

		const parameters = {
			size: 0.01,
			count: 100000,
			branches: 8,
			radius: 5,
			spin: 1,
			randomness: 0.1,
			randomnessPower: 3,
			insideColor: 0xff6030,
			outsideColor: 0x391eb9,
		};

		let points;
		let pointGeometry;
		let pointMaterial;

		function generateGalaxy() {
			const positions = new Float32Array(parameters.count * 3);
			const colors = new Float32Array(parameters.count * 3);

			const colorInside = new THREE.Color(parameters.insideColor);
			const colorOutside = new THREE.Color(parameters.outsideColor);

			if (points) {
				scene.remove(points);
				pointGeometry.dispose();
				pointMaterial.dispose();
			}

			for (let i = 0; i < parameters.count; i++) {
				const i3 = i * 3;
				const branchAngle = ((i % parameters.branches) / parameters.branches) * (Math.PI * 2);
				const radius = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius;
				const spin = radius + parameters.spin;

				const currentColor = colorInside.clone();
				currentColor.lerp(colorOutside, radius / parameters.radius);

				const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radius * parameters.randomness;
				const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radius * parameters.randomness;
				const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radius * parameters.randomness;

				positions[i3] = Math.cos(branchAngle + spin) * radius + randomX;
				positions[i3 + 1] = randomY;
				positions[i3 + 2] = Math.sin(branchAngle + spin) * radius + randomZ;

				colors[i3] = currentColor.r;
				colors[i3 + 1] = currentColor.g;
				colors[i3 + 2] = currentColor.b;
			}

			pointGeometry = new THREE.BufferGeometry();
			pointMaterial = new THREE.PointsMaterial({
				size: parameters.size,
				sizeAttenuation: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true,
			});

			pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

			points = new THREE.Points(pointGeometry, pointMaterial);
			scene.add(points);
		}

		generateGalaxy();

		const galaxy = gui.addFolder('galaxy');
		galaxy.add(parameters, 'size').min(0).max(0.5).step(0.0001).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'spin').min(0).max(10).step(1).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'radius').min(1).max(10).step(1).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'branches').min(1).max(10).step(1).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'randomness').min(0).max(1).step(0.001).onFinishChange(generateGalaxy);
		galaxy.add(parameters, 'randomnessPower').min(1).max(5).step(1).onFinishChange(generateGalaxy);
		galaxy.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
		galaxy.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
		galaxy.open();

		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
		camera.position.set(3, 2, 3);
		scene.add(camera);

		const controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const clock = new THREE.Clock();

		const tick = () => {
			const elapsedTime = clock.getElapsedTime();
			controls.update();
			renderer.render(scene, camera);
			requestAnimationFrame(tick);
		};

		tick();

		window.addEventListener('resize', () => {
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});

		// Cleanup on unmount
		return () => {
			gui.destroy();
			renderer.dispose();
		};
	}, []);

	return <canvas ref={mountRef} className="webgl" />;
};

export default Galaxy;
